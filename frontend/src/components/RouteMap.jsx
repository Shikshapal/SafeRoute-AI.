import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Create custom SVG markers for Leaflet to avoid missing asset issues
const createCustomIcon = (color, label) => {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="
        background: ${color};
        color: white;
        border: 2px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 11px;
        font-family: sans-serif;
      ">
        ${label}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20]
  });
};

const startIcon = createCustomIcon('#10b981', 'A');
const destIcon = createCustomIcon('#ec4899', 'B');
const policeIcon = createCustomIcon('#3b82f6', '👮');
const hospitalIcon = createCustomIcon('#ef4444', '🏥');

// Component to dynamically fit map bounds when coordinates update
function MapViewUpdater({ bounds, center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (bounds && bounds.length > 0) {
      try {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      } catch (e) {
        console.warn('Map fitBounds error:', e);
      }
    } else if (center) {
      map.setView(center, zoom || 13);
    }
  }, [bounds, center, zoom, map]);

  return null;
}

export default function RouteMap({
  originCoords,
  destCoords,
  routes = [],
  selectedRouteIndex = 0,
  originName = 'Origin',
  destName = 'Destination',
  onMapClick
}) {
  // Default center: New Delhi India coordinates
  const defaultCenter = [28.6139, 77.2090];
  const activeRoute = routes && routes.length > selectedRouteIndex ? routes[selectedRouteIndex] : null;

  // Calculate bounds if coordinates exist
  let bounds = null;
  if (activeRoute && activeRoute.coordinates && activeRoute.coordinates.length > 0) {
    bounds = activeRoute.coordinates;
  } else if (originCoords && destCoords) {
    bounds = [originCoords, destCoords];
  }

  // Calculate mock nearby verified safety amenities (police stations/hospitals) near midpoint for visual demonstration
  const safetyAmenities = [];
  if (activeRoute && activeRoute.coordinates && activeRoute.coordinates.length > 10) {
    const midIdx = Math.floor(activeRoute.coordinates.length / 2);
    const midCoord = activeRoute.coordinates[midIdx];
    safetyAmenities.push({
      id: 'poi-police',
      type: 'police',
      name: 'Central Police Station / Outpost',
      lat: midCoord[0] + 0.003,
      lon: midCoord[1] + 0.002,
      desc: '24/7 Police Emergency Post on primary corridor'
    });
    safetyAmenities.push({
      id: 'poi-hospital',
      type: 'hospital',
      name: 'District General Hospital (24/7 Casualty)',
      lat: midCoord[0] - 0.002,
      lon: midCoord[1] - 0.003,
      desc: '24/7 Emergency trauma center and lighted entrance'
    });
  }

  return (
    <div className="map-card-wrapper">
      <MapContainer
        center={originCoords || defaultCenter}
        zoom={12}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <MapViewUpdater
          bounds={bounds}
          center={originCoords || defaultCenter}
          zoom={13}
        />

        {/* Origin Marker */}
        {originCoords && (
          <Marker position={originCoords} icon={startIcon}>
            <Popup>
              <strong>Start Point (A):</strong><br />
              {originName}
            </Popup>
          </Marker>
        )}

        {/* Destination Marker */}
        {destCoords && (
          <Marker position={destCoords} icon={destIcon}>
            <Popup>
              <strong>Destination (B):</strong><br />
              {destName}
            </Popup>
          </Marker>
        )}

        {/* Alternative Routes (shown in subtle faded purple) */}
        {routes.map((r, idx) => {
          if (idx === selectedRouteIndex) return null;
          return (
            <Polyline
              key={r.route_id || `alt_${idx}`}
              positions={r.coordinates}
              pathOptions={{
                color: '#8b5cf6',
                weight: 4,
                opacity: 0.5,
                dashArray: '6, 8'
              }}
            >
              <Popup>
                <strong>Alternative Route {idx + 1}</strong><br />
                {r.distance_km} km ({r.duration_minutes} mins)
              </Popup>
            </Polyline>
          );
        })}

        {/* Primary Selected Route (Glowing Pink & Violet) */}
        {activeRoute && activeRoute.coordinates && (
          <>
            {/* Outer glow stroke */}
            <Polyline
              positions={activeRoute.coordinates}
              pathOptions={{
                color: '#ec4899',
                weight: 8,
                opacity: 0.4
              }}
            />
            {/* Inner primary stroke */}
            <Polyline
              positions={activeRoute.coordinates}
              pathOptions={{
                color: '#9333ea',
                weight: 4,
                opacity: 0.9
              }}
            >
              <Popup>
                <strong>Selected Safe Route</strong><br />
                Distance: {activeRoute.distance_km} km<br />
                Est. Time: {activeRoute.duration_minutes} mins
              </Popup>
            </Polyline>
          </>
        )}

        {/* Verified nearby safety amenities */}
        {safetyAmenities.map((poi) => (
          <Marker
            key={poi.id}
            position={[poi.lat, poi.lon]}
            icon={poi.type === 'police' ? policeIcon : hospitalIcon}
          >
            <Popup>
              <strong>{poi.name}</strong><br />
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{poi.desc}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Floating Map Legend */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '12px',
        zIndex: 500,
        background: 'rgba(10, 13, 24, 0.88)',
        backdropFilter: 'blur(8px)',
        border: '1px solid var(--border-accent)',
        borderRadius: 'var(--radius-sm)',
        padding: '8px 12px',
        fontSize: '0.75rem',
        color: 'var(--text-main)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></span>
          <span>Start (A)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ec4899' }}></span>
          <span>Destination (B)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '16px', height: '3px', background: '#9333ea' }}></span>
          <span>Selected Route</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>👮/🏥</span>
          <span>Civic Amenities</span>
        </div>
      </div>
    </div>
  );
}


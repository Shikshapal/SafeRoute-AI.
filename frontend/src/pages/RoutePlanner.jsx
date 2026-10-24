import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  MapPin, 
  Car, 
  Footprints, 
  Search, 
  Crosshair, 
  ShieldCheck, 
  AlertCircle, 
  Share2, 
  Clock, 
  Route as RouteIcon,
  CheckCircle,
  ChevronRight,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import RouteMap from '../components/RouteMap';

// Preset sample cities for fast one-click testing in hackathons
const PRESET_ROUTES = [
  {
    name: 'Delhi: Connaught Place to Cyber City Gurgaon',
    start: [28.6328, 77.2197],
    startName: 'Connaught Place, New Delhi',
    dest: [28.4952, 77.0895],
    destName: 'Cyber City, Gurugram'
  },
  {
    name: 'Bengaluru: MG Road to Koramangala 5th Block',
    start: [12.9753, 77.6067],
    startName: 'MG Road Metro, Bengaluru',
    dest: [12.9352, 77.6245],
    destName: 'Koramangala 5th Block, Bengaluru'
  },
  {
    name: 'Mumbai: Bandra Station to BKC Commercial Hub',
    start: [19.0544, 72.8402],
    startName: 'Bandra Station West, Mumbai',
    dest: [19.0657, 72.8687],
    destName: 'Bandra Kurla Complex (BKC), Mumbai'
  }
];

export default function RoutePlanner({ onTriggerSos }) {
  // Coordinates in [lat, lon]
  const [startCoords, setStartCoords] = useState(PRESET_ROUTES[0].start);
  const [startName, setStartName] = useState(PRESET_ROUTES[0].startName);
  const [destCoords, setDestCoords] = useState(PRESET_ROUTES[0].dest);
  const [destName, setDestName] = useState(PRESET_ROUTES[0].destName);

  const [travelMode, setTravelMode] = useState('driving'); // driving | walking
  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState(null);

  // Search autocomplete states
  const [startQuery, setStartQuery] = useState(PRESET_ROUTES[0].startName);
  const [destQuery, setDestQuery] = useState(PRESET_ROUTES[0].destName);
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [isSearchingStart, setIsSearchingStart] = useState(false);
  const [isSearchingDest, setIsSearchingDest] = useState(false);

  // Manual coordinate input toggle
  const [showManualCoords, setShowManualCoords] = useState(false);
  const [manualStartLat, setManualStartLat] = useState(PRESET_ROUTES[0].start[0].toString());
  const [manualStartLon, setManualStartLon] = useState(PRESET_ROUTES[0].start[1].toString());
  const [manualDestLat, setManualDestLat] = useState(PRESET_ROUTES[0].dest[0].toString());
  const [manualDestLon, setManualDestLon] = useState(PRESET_ROUTES[0].dest[1].toString());

  // Routing calculation states
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [routeData, setRouteData] = useState(null);
  const [selectedRouteIdx, setSelectedRouteIdx] = useState(0);
  const [planError, setPlanError] = useState(null);
  const [copiedShare, setCopiedShare] = useState(false);

  // Fetch initial route on mount
  useEffect(() => {
    fetchRoute(PRESET_ROUTES[0].start, PRESET_ROUTES[0].dest, 'driving');
  }, []);

  const fetchRoute = async (start, dest, mode) => {
    if (!start || !dest) return;
    setLoadingRoute(true);
    setPlanError(null);

    try {
      const response = await api.planRoute(start, dest, mode);
      if (response && response.success && response.routes && response.routes.length > 0) {
        setRouteData(response);
        setSelectedRouteIdx(0);
      } else {
        setPlanError(response?.error || 'Unable to compute route between selected points.');
      }
    } catch (err) {
      console.error('Route calculation failed:', err);
      setPlanError('Network error connecting to routing service. Please retry.');
    } finally {
      setLoadingRoute(false);
    }
  };

  // Browser Geolocation with permission
  const handleUseCurrentLocation = () => {
    setGpsError(null);
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser. Please enter location manually.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setStartCoords(coords);
        setManualStartLat(coords[0].toFixed(5));
        setManualStartLon(coords[1].toFixed(5));
        setIsLocating(false);

        // Reverse geocode to get name
        try {
          const rev = await api.reverseGeocode(coords[0], coords[1]);
          const name = rev?.display_name || `GPS: ${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}`;
          setStartName(name);
          setStartQuery(name);
        } catch {
          const fallback = `GPS: ${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}`;
          setStartName(fallback);
          setStartQuery(fallback);
        }

        if (destCoords) {
          fetchRoute(coords, destCoords, travelMode);
        }
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGpsError('Location permission denied. You can manually enter coordinates or use search.');
        } else {
          setGpsError('Could not determine current location. Please use the search bar or presets.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Geocoding Search for Start
  const handleStartSearch = async (val) => {
    setStartQuery(val);
    if (val.length < 3) {
      setStartSuggestions([]);
      return;
    }
    setIsSearchingStart(true);
    try {
      const res = await api.geocodeLocation(val);
      if (res && res.success) {
        setStartSuggestions(res.results || []);
      }
    } catch (e) {
      console.warn('Start search error:', e);
    } finally {
      setIsSearchingStart(false);
    }
  };

  // Geocoding Search for Destination
  const handleDestSearch = async (val) => {
    setDestQuery(val);
    if (val.length < 3) {
      setDestSuggestions([]);
      return;
    }
    setIsSearchingDest(true);
    try {
      const res = await api.geocodeLocation(val);
      if (res && res.success) {
        setDestSuggestions(res.results || []);
      }
    } catch (e) {
      console.warn('Dest search error:', e);
    } finally {
      setIsSearchingDest(false);
    }
  };

  const handleSelectStart = (item) => {
    const coords = [item.lat, item.lon];
    setStartCoords(coords);
    setStartName(item.display_name);
    setStartQuery(item.display_name);
    setManualStartLat(item.lat.toFixed(5));
    setManualStartLon(item.lon.toFixed(5));
    setStartSuggestions([]);
    if (destCoords) {
      fetchRoute(coords, destCoords, travelMode);
    }
  };

  const handleSelectDest = (item) => {
    const coords = [item.lat, item.lon];
    setDestCoords(coords);
    setDestName(item.display_name);
    setDestQuery(item.display_name);
    setManualDestLat(item.lat.toFixed(5));
    setManualDestLon(item.lon.toFixed(5));
    setDestSuggestions([]);
    if (startCoords) {
      fetchRoute(startCoords, coords, travelMode);
    }
  };

  const handleApplyManualCoords = () => {
    const sLat = parseFloat(manualStartLat);
    const sLon = parseFloat(manualStartLon);
    const dLat = parseFloat(manualDestLat);
    const dLon = parseFloat(manualDestLon);

    if (isNaN(sLat) || isNaN(sLon) || isNaN(dLat) || isNaN(dLon)) {
      setPlanError('Please enter valid numeric latitude and longitude coordinates.');
      return;
    }

    const sCoords = [sLat, sLon];
    const dCoords = [dLat, dLon];
    setStartCoords(sCoords);
    setDestCoords(dCoords);
    setStartName(`Manual (${sLat.toFixed(4)}, ${sLon.toFixed(4)})`);
    setDestName(`Manual (${dLat.toFixed(4)}, ${dLon.toFixed(4)})`);
    fetchRoute(sCoords, dCoords, travelMode);
  };

  const handleApplyPreset = (preset) => {
    setStartCoords(preset.start);
    setStartName(preset.startName);
    setStartQuery(preset.startName);
    setDestCoords(preset.dest);
    setDestName(preset.destName);
    setDestQuery(preset.destName);
    setManualStartLat(preset.start[0].toString());
    setManualStartLon(preset.start[1].toString());
    setManualDestLat(preset.dest[0].toString());
    setManualDestLon(preset.dest[1].toString());
    fetchRoute(preset.start, preset.dest, travelMode);
  };

  const handleModeChange = (mode) => {
    setTravelMode(mode);
    if (startCoords && destCoords) {
      fetchRoute(startCoords, destCoords, mode);
    }
  };

  const handleShareRoute = async () => {
    const shareText = `🚶‍♀️ SafeRoute AI Journey Plan:\nFrom: ${startName}\nTo: ${destName}\nMode: ${travelMode.toUpperCase()}\nEstimated Distance: ${currentRoute?.distance_km} km\nEstimated Time: ~${currentRoute?.duration_minutes} mins\nSafety: Following main lit corridors. Emergency dial: 112.`;
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } catch {
      alert('Copied journey plan to clipboard!');
    }
  };

  const currentRoute = routeData?.routes?.[selectedRouteIdx] || null;
  const safetyAdvisory = routeData?.safety_advisory || null;

  return (
    <div className="container" style={{ paddingBottom: '40px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <div className="badge badge-purple" style={{ marginBottom: '8px' }}>
          Interactive Map & Navigation
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'white' }}>
          Safe Route Planner
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Explore routes using open mapping, compare alternatives, and access verified contextual safety guidance.
        </p>
      </div>

      {/* Preset Fast Picker for Hackathon Demonstration */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-accent)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 16px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#c084fc' }}>
          Quick Demo Presets:
        </span>
        {PRESET_ROUTES.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleApplyPreset(p)}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* GPS Error Alert if any */}
      {gpsError && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          marginBottom: '16px',
          fontSize: '0.82rem',
          color: '#fca5a5',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle size={16} />
          <span>{gpsError}</span>
        </div>
      )}

      {/* Main Grid: Sidebar Inputs + Leaflet Map */}
      <div className="planner-layout">
        {/* Left Column: Route Inputs & Safety Advisory */}
        <div className="planner-sidebar">
          <div className="glass-card" style={{ padding: '20px' }}>
            {/* Travel Mode Toggle */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                Mode of Travel
              </label>
              <div className="mode-toggle-group">
                <button
                  className={`mode-btn ${travelMode === 'driving' ? 'active' : ''}`}
                  onClick={() => handleModeChange('driving')}
                >
                  <Car size={16} />
                  <span>Driving / Cab</span>
                </button>
                <button
                  className={`mode-btn ${travelMode === 'walking' ? 'active' : ''}`}
                  onClick={() => handleModeChange('walking')}
                >
                  <Footprints size={16} />
                  <span>Walking</span>
                </button>
              </div>
            </div>

            {/* Starting Location Input */}
            <div className="search-group" style={{ marginBottom: '16px' }}>
              <div className="search-label">
                <span>Start Point (A)</span>
                <button 
                  onClick={handleUseCurrentLocation}
                  style={{ background: 'none', color: '#c084fc', fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Crosshair size={12} />
                  <span>{isLocating ? 'Locating...' : 'My Location'}</span>
                </button>
              </div>
              <div className="search-input-wrapper">
                <MapPin size={16} className="search-icon-left" color="#10b981" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Enter starting point (e.g. Connaught Place)..."
                  value={startQuery}
                  onChange={(e) => handleStartSearch(e.target.value)}
                />
              </div>

              {/* Suggestions */}
              {startSuggestions.length > 0 && (
                <div className="autocomplete-dropdown">
                  {startSuggestions.map((item, idx) => (
                    <div
                      key={idx}
                      className="autocomplete-item"
                      onClick={() => handleSelectStart(item)}
                    >
                      <MapPin size={14} color="#10b981" />
                      <span>{item.display_name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Destination Location Input */}
            <div className="search-group" style={{ marginBottom: '16px' }}>
              <div className="search-label">
                <span>Destination (B)</span>
              </div>
              <div className="search-input-wrapper">
                <MapPin size={16} className="search-icon-left" color="#ec4899" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Enter destination (e.g. Cyber City)..."
                  value={destQuery}
                  onChange={(e) => handleDestSearch(e.target.value)}
                />
              </div>

              {/* Suggestions */}
              {destSuggestions.length > 0 && (
                <div className="autocomplete-dropdown">
                  {destSuggestions.map((item, idx) => (
                    <div
                      key={idx}
                      className="autocomplete-item"
                      onClick={() => handleSelectDest(item)}
                    >
                      <MapPin size={14} color="#ec4899" />
                      <span>{item.display_name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Manual Lat/Lon Toggle */}
            <div style={{ marginBottom: '16px' }}>
              <button
                onClick={() => setShowManualCoords(!showManualCoords)}
                style={{
                  background: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>{showManualCoords ? 'Hide manual coordinates' : 'Or enter exact GPS coordinates manually'}</span>
              </button>

              {showManualCoords && (
                <div style={{
                  marginTop: '10px',
                  padding: '12px',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    <div>
                      <span style={{ color: 'var(--text-dim)' }}>Start Lat</span>
                      <input
                        type="text"
                        value={manualStartLat}
                        onChange={(e) => setManualStartLat(e.target.value)}
                        style={{ width: '100%', padding: '6px' }}
                      />
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)' }}>Start Lon</span>
                      <input
                        type="text"
                        value={manualStartLon}
                        onChange={(e) => setManualStartLon(e.target.value)}
                        style={{ width: '100%', padding: '6px' }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    <div>
                      <span style={{ color: 'var(--text-dim)' }}>Dest Lat</span>
                      <input
                        type="text"
                        value={manualDestLat}
                        onChange={(e) => setManualDestLat(e.target.value)}
                        style={{ width: '100%', padding: '6px' }}
                      />
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)' }}>Dest Lon</span>
                      <input
                        type="text"
                        value={manualDestLon}
                        onChange={(e) => setManualDestLon(e.target.value)}
                        style={{ width: '100%', padding: '6px' }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleApplyManualCoords}
                    style={{
                      width: '100%',
                      background: 'var(--accent-purple)',
                      color: 'white',
                      padding: '6px',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: '700'
                    }}
                  >
                    Apply Coordinates
                  </button>
                </div>
              )}
            </div>

            {/* Recalculate Route Button */}
            <button
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => fetchRoute(startCoords, destCoords, travelMode)}
              disabled={loadingRoute}
            >
              <RouteIcon size={16} />
              <span>{loadingRoute ? 'Calculating Open Route...' : 'Recalculate Route'}</span>
            </button>
          </div>

          {/* Route Alternatives Switcher */}
          {routeData?.routes && routeData.routes.length > 1 && (
            <div className="glass-card" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '10px' }}>
                Alternative Routes Available ({routeData.routes.length}):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {routeData.routes.map((r, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedRouteIdx(idx)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: selectedRouteIdx === idx ? 'rgba(147, 51, 234, 0.2)' : 'var(--bg-secondary)',
                      border: `1px solid ${selectedRouteIdx === idx ? 'var(--accent-purple)' : 'var(--border-subtle)'}`,
                      color: 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>
                        {idx === 0 ? 'Primary Recommended' : `Alternative #${idx + 1}`}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {r.summary || 'Via Main Road'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '800', color: '#c084fc', fontSize: '0.9rem' }}>
                        {r.distance_km} km
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        ~{r.duration_minutes} min
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Transparent Safety Advisory Card */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="#c084fc" />
                <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'white' }}>
                  Safety Indicator Notice
                </span>
              </div>
              {/* STRICT REQUIREMENT: Clearly display "Safety data unavailable" */}
              <span className="badge badge-warning">
                Safety Data Unavailable
              </span>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '14px' }}>
              {safetyAdvisory?.transparency_notice || 
                'Official micro-level crime datasets are not publicly published for this corridor. SafeRoute AI never fabricates fake safety scores.'}
            </p>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
                Recommended Situational Precautions:
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {(safetyAdvisory?.recommended_precautions || [
                  'Stay on well-lit primary roads with open shops and transit links.',
                  'Keep phone battery above 30% before starting navigation.',
                  'Share live location with a trusted friend or family member.'
                ]).map((tip, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                    <CheckCircle size={14} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Map & Live Navigation Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Top Route Summary Bar */}
          {currentRoute && (
            <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '600' }}>Distance</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f472b6', fontFamily: 'var(--font-mono)' }}>
                    {currentRoute.distance_km} km
                  </div>
                </div>
                <div style={{ width: '1px', height: '36px', background: 'var(--border-subtle)' }}></div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '600' }}>Est. Travel Time</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#c084fc', fontFamily: 'var(--font-mono)' }}>
                    ~{currentRoute.duration_minutes} mins
                  </div>
                </div>
                <div style={{ width: '1px', height: '36px', background: 'var(--border-subtle)' }}></div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '600' }}>Routing Engine</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>
                    OSRM Public Service
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="btn-secondary"
                  onClick={handleShareRoute}
                  style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                >
                  <Share2 size={16} />
                  <span>{copiedShare ? 'Copied Plan!' : 'Share Trip Plan'}</span>
                </button>
                <button
                  className="btn-danger"
                  onClick={onTriggerSos}
                  style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                >
                  <AlertCircle size={16} />
                  <span>SOS 112</span>
                </button>
              </div>
            </div>
          )}

          {/* Leaflet Map Card */}
          <RouteMap
            originCoords={startCoords}
            destCoords={destCoords}
            routes={routeData?.routes || []}
            selectedRouteIndex={selectedRouteIdx}
            originName={startName}
            destName={destName}
          />

          {/* Turn-by-Turn Key Checkpoints Preview */}
          {currentRoute?.steps && currentRoute.steps.length > 0 && (
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'white', marginBottom: '12px' }}>
                Turn-by-Turn Safety Corridor Checkpoints:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                {currentRoute.steps.slice(0, 6).map((step, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--bg-secondary)',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <span style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(147, 51, 234, 0.2)',
                      color: '#c084fc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      flexShrink: 0
                    }}>
                      {idx + 1}
                    </span>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', flex: 1 }}>
                      {step.instruction || 'Proceed on road'}
                    </div>
                    {step.distance_meters > 0 && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                        {step.distance_meters > 1000 ? `${(step.distance_meters / 1000).toFixed(1)}km` : `${step.distance_meters}m`}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


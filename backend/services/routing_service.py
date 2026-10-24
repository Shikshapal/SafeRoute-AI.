"""
Routing Service
Integrates with OpenStreetMap Nominatim for geocoding
and Open Source Routing Machine (OSRM) for route calculation.
Handles network failures, timeouts, and fallback gracefully.
"""

import logging
import requests
from config import Config

logger = logging.getLogger(__name__)

HEADERS = {
    "User-Agent": Config.USER_AGENT,
    "Accept": "application/json"
}

def geocode_location(query):
    """
    Geocodes a search string into geographic coordinates using OpenStreetMap Nominatim.
    """
    if not query or len(query.strip()) < 2:
        return {"success": False, "error": "Query too short", "results": []}

    try:
        url = f"{Config.NOMINATIM_BASE_URL}/search"
        params = {
            "q": query.strip(),
            "format": "json",
            "limit": 5,
            "addressdetails": 1
        }
        response = requests.get(url, params=params, headers=HEADERS, timeout=6)
        if response.status_code == 200:
            data = response.json()
            results = []
            for item in data:
                results.append({
                    "display_name": item.get("display_name", ""),
                    "lat": float(item.get("lat")),
                    "lon": float(item.get("lon")),
                    "type": item.get("type", "location"),
                    "importance": item.get("importance", 0)
                })
            return {"success": True, "results": results}
        else:
            logger.warning(f"Nominatim returned status {response.status_code}")
            return {"success": False, "error": f"Geocoding service returned {response.status_code}", "results": []}
    except Exception as e:
        logger.error(f"Geocoding error: {str(e)}")
        return {"success": False, "error": f"Geocoding request failed: {str(e)}", "results": []}


def reverse_geocode(lat, lon):
    """
    Converts latitude and longitude into a human-readable address.
    """
    try:
        url = f"{Config.NOMINATIM_BASE_URL}/reverse"
        params = {
            "lat": lat,
            "lon": lon,
            "format": "json",
            "zoom": 16
        }
        response = requests.get(url, params=params, headers=HEADERS, timeout=6)
        if response.status_code == 200:
            data = response.json()
            return {
                "success": True,
                "display_name": data.get("display_name", f"Coordinates: {lat:.4f}, {lon:.4f}"),
                "address": data.get("address", {})
            }
        return {"success": False, "display_name": f"Location: {lat:.4f}, {lon:.4f}"}
    except Exception as e:
        logger.error(f"Reverse geocode error: {str(e)}")
        return {"success": False, "display_name": f"Location: {lat:.4f}, {lon:.4f}"}


def calculate_route(start_lat, start_lon, end_lat, end_lon, travel_mode="driving"):
    """
    Requests route options from the OSRM public service.
    Returns primary route, alternatives (if any), turn-by-turn steps, distance, and duration.
    Coordinates in OSRM are passed as: {lon},{lat}
    Leaflet uses: [lat, lon]
    """
    profile = "car" if travel_mode == "driving" else "foot"
    
    # OSRM public endpoint
    osrm_url = (
        f"{Config.OSRM_BASE_URL}/route/v1/{profile}/"
        f"{start_lon},{start_lat};{end_lon},{end_lat}"
        f"?overview=full&geometries=geojson&alternatives=true&steps=true"
    )

    try:
        resp = requests.get(osrm_url, headers=HEADERS, timeout=8)
        if resp.status_code == 200:
            data = resp.json()
            if data.get("code") == "Ok" and data.get("routes"):
                parsed_routes = []
                for idx, r in enumerate(data["routes"]):
                    raw_coords = r.get("geometry", {}).get("coordinates", [])
                    # OSRM coordinates are [lon, lat], transform to [lat, lon] for Leaflet
                    leaflet_coords = [[coord[1], coord[0]] for coord in raw_coords]
                    
                    # Extract step maneuvers
                    steps_list = []
                    legs = r.get("legs", [])
                    for leg in legs:
                        for step in leg.get("steps", []):
                            maneuver = step.get("maneuver", {})
                            steps_list.append({
                                "instruction": step.get("name") or maneuver.get("type", "Proceed"),
                                "type": maneuver.get("type", "turn"),
                                "modifier": maneuver.get("modifier", ""),
                                "distance_meters": round(step.get("distance", 0)),
                                "duration_seconds": round(step.get("duration", 0))
                            })

                    parsed_routes.append({
                        "route_id": f"route_{idx + 1}",
                        "is_primary": idx == 0,
                        "distance_meters": r.get("distance", 0),
                        "duration_seconds": r.get("duration", 0),
                        "distance_km": round(r.get("distance", 0) / 1000.0, 2),
                        "duration_minutes": round(r.get("duration", 0) / 60.0),
                        "coordinates": leaflet_coords,
                        "steps": steps_list[:12],  # Provide top navigation steps
                        "summary": r.get("legs", [{}])[0].get("summary", f"Via Main Road #{idx + 1}")
                    })

                return {
                    "success": True,
                    "service_provider": "OSRM (Open Source Routing Machine)",
                    "travel_mode": travel_mode,
                    "routes": parsed_routes
                }
            else:
                return _generate_fallback_route(start_lat, start_lon, end_lat, end_lon, travel_mode, "No route found between selected points.")
        else:
            return _generate_fallback_route(start_lat, start_lon, end_lat, end_lon, travel_mode, f"OSRM service returned HTTP {resp.status_code}.")
    except Exception as e:
        logger.warning(f"OSRM routing failed: {str(e)}. Using fallback route.")
        return _generate_fallback_route(start_lat, start_lon, end_lat, end_lon, travel_mode, f"Routing service connection error: {str(e)}")


def _generate_fallback_route(start_lat, start_lon, end_lat, end_lon, travel_mode, reason=""):
    """
    Generates a graceful fallback path if the external OSRM service is unreachable,
    ensuring the hackathon demo remains functional and never crashes the UI.
    """
    import math

    # Haversine distance
    R = 6371.0 # Earth radius in km
    dlat = math.radians(end_lat - start_lat)
    dlon = math.radians(end_lon - start_lon)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(start_lat)) * math.cos(math.radians(end_lat)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    dist_km = round(R * c, 2)
    
    # Estimate time (avg 35 km/h driving, 4.5 km/h walking)
    speed = 35.0 if travel_mode == "driving" else 4.5
    est_duration_mins = max(1, round((dist_km / speed) * 60))

    # Generate 5 intermediate points for line rendering
    coords = []
    steps = 6
    for i in range(steps + 1):
        ratio = i / float(steps)
        lat = start_lat + (end_lat - start_lat) * ratio
        lon = start_lon + (end_lon - start_lon) * ratio
        coords.append([lat, lon])

    return {
        "success": True,
        "is_fallback": True,
        "service_provider": "Direct Line Estimation (Fallback)",
        "fallback_notice": f"Live routing service was unavailable ({reason}). Displaying direct route approximation.",
        "travel_mode": travel_mode,
        "routes": [{
            "route_id": "fallback_route_1",
            "is_primary": True,
            "distance_meters": int(dist_km * 1000),
            "duration_seconds": est_duration_mins * 60,
            "distance_km": dist_km,
            "duration_minutes": est_duration_mins,
            "coordinates": coords,
            "steps": [
                {"instruction": "Depart from origin", "distance_meters": 0, "duration_seconds": 0},
                {"instruction": f"Proceed along primary corridor towards destination (~{dist_km} km)", "distance_meters": int(dist_km * 1000), "duration_seconds": est_duration_mins * 60},
                {"instruction": "Arrive at destination", "distance_meters": 0, "duration_seconds": 0}
            ],
            "summary": "Direct navigation corridor"
        }]
    }


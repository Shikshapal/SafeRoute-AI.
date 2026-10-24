"""
API Routes
Exposes REST endpoints for routing, safety information,
emergency numbers, and AI safety assistant.
"""

from flask import Blueprint, request, jsonify
from services.emergency_service import get_verified_helplines
from services.safety_service import get_all_safety_tips, get_safety_categories, evaluate_route_safety
from services.routing_service import geocode_location, reverse_geocode, calculate_route
from services.ai_service import query_ai_assistant

api_bp = Blueprint("api", __name__, url_prefix="/api")


@api_bp.route("/health", methods=["GET"])
def health_check():
    """
    Health check endpoint returning system status and services availability.
    """
    return jsonify({
        "status": "healthy",
        "service": "SafeRoute AI Backend",
        "version": "1.0.0",
        "features": {
            "routing": "OSRM OpenStreetMap",
            "geocoding": "Nominatim",
            "ai_mode": "Offline Knowledge Base / Optional LLM",
            "emergency_coverage": "India Unified (112, 1091, 181, 1930)"
        }
    }), 200


@api_bp.route("/emergency/helplines", methods=["GET"])
def get_helplines():
    """
    Returns curated list of verified emergency helplines in India.
    """
    try:
        helplines = get_verified_helplines()
        return jsonify({
            "success": True,
            "count": len(helplines),
            "data": helplines
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@api_bp.route("/safety/tips", methods=["GET"])
def get_safety_tips():
    """
    Returns safety tips, optionally filtered by ?category=...
    """
    try:
        category = request.args.get("category", default=None)
        tips = get_all_safety_tips(category_filter=category)
        return jsonify({
            "success": True,
            "category_filter": category or "All",
            "count": len(tips),
            "data": tips
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@api_bp.route("/safety/categories", methods=["GET"])
def get_categories():
    """
    Returns available safety categories.
    """
    try:
        categories = get_safety_categories()
        return jsonify({
            "success": True,
            "data": categories
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@api_bp.route("/routes/geocode", methods=["GET"])
def geocode():
    """
    Geocodes a search string using OpenStreetMap Nominatim.
    Query param: ?q=...
    """
    query = request.args.get("q", "").strip()
    if not query:
        return jsonify({"success": False, "error": "Query parameter 'q' is required."}), 400

    result = geocode_location(query)
    return jsonify(result), 200 if result.get("success") else 502


@api_bp.route("/routes/reverse-geocode", methods=["GET"])
def reverse_geocode_api():
    """
    Converts coordinates to address.
    Query params: ?lat=...&lon=...
    """
    try:
        lat = float(request.args.get("lat"))
        lon = float(request.args.get("lon"))
        res = reverse_geocode(lat, lon)
        return jsonify(res), 200
    except (TypeError, ValueError):
        return jsonify({"success": False, "error": "Invalid or missing lat/lon parameters"}), 400


@api_bp.route("/routes/plan", methods=["POST"])
def plan_route():
    """
    Calculates route between origin and destination coordinates.
    Evaluates transparent safety guidance for the journey.
    Expected JSON payload:
    {
      "start": [lat, lon],
      "destination": [lat, lon],
      "travel_mode": "driving" | "walking"
    }
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"success": False, "error": "Invalid JSON body provided."}), 400

    start = data.get("start")
    destination = data.get("destination")
    travel_mode = data.get("travel_mode", "driving").lower()

    if travel_mode not in ["driving", "walking"]:
        travel_mode = "driving"

    # Input validation
    if not start or not isinstance(start, (list, tuple)) or len(start) != 2:
        return jsonify({"success": False, "error": "Start coordinates must be a [lat, lon] pair."}), 400

    if not destination or not isinstance(destination, (list, tuple)) or len(destination) != 2:
        return jsonify({"success": False, "error": "Destination coordinates must be a [lat, lon] pair."}), 400

    try:
        start_lat, start_lon = float(start[0]), float(start[1])
        dest_lat, dest_lon = float(destination[0]), float(destination[1])
    except (ValueError, TypeError):
        return jsonify({"success": False, "error": "Latitude and longitude must be valid floating point numbers."}), 400

    # Bounds check
    if not (-90 <= start_lat <= 90 and -180 <= start_lon <= 180 and -90 <= dest_lat <= 90 and -180 <= dest_lon <= 180):
        return jsonify({"success": False, "error": "Coordinates out of geographic range."}), 400

    # Fetch route from OSRM
    route_response = calculate_route(start_lat, start_lon, dest_lat, dest_lon, travel_mode=travel_mode)

    # Attach transparent safety evaluation for primary route
    primary_route = route_response.get("routes", [{}])[0]
    distance = primary_route.get("distance_meters", 0)
    duration = primary_route.get("duration_seconds", 0)
    waypoints_count = len(primary_route.get("coordinates", []))

    safety_evaluation = evaluate_route_safety(distance, duration, waypoints_count, travel_mode=travel_mode)
    route_response["safety_advisory"] = safety_evaluation

    return jsonify(route_response), 200


@api_bp.route("/ai/chat", methods=["POST"])
def ai_chat():
    """
    AI Safety Assistant conversation endpoint.
    Expected JSON payload:
    {
      "message": "User query string",
      "history": [...] (optional)
    }
    """
    data = request.get_json(silent=True)
    if not data or "message" not in data:
        return jsonify({"success": False, "error": "JSON body with 'message' field is required."}), 400

    user_message = data.get("message", "").strip()
    history = data.get("history", [])

    if not user_message:
        return jsonify({"success": False, "error": "Message content cannot be blank."}), 400

    try:
        response = query_ai_assistant(user_message, conversation_history=history)
        return jsonify({
            "success": True,
            "data": response
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": f"AI Assistant error: {str(e)}"}), 500


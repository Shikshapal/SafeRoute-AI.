import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    PORT = int(os.environ.get("PORT", 5000))
    HOST = os.environ.get("HOST", "127.0.0.1")
    DEBUG = os.environ.get("DEBUG", "True").lower() == "true"
    
    # OpenStreetMap / OSRM public service endpoints
    OSRM_BASE_URL = os.environ.get("OSRM_BASE_URL", "https://router.project-osrm.org")
    NOMINATIM_BASE_URL = os.environ.get("NOMINATIM_BASE_URL", "https://nominatim.openstreetmap.org")
    USER_AGENT = "SafeRouteAI-WomenSafetyAssistant/1.0"
    
    # Optional AI keys (if user provides one in .env; runs offline demo mode otherwise)
    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
    OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")


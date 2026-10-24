# SafeRoute AI – Women Safety Assistant
> **“Your Safety, Your Journey.”**  
> *A Modern, Ethical, Full-Stack Women's Safety & Navigation Web Application for Hackathons.*

---

## 🌟 Executive Summary
**SafeRoute AI** is an advanced women’s safety web application engineered to bridge the gap between situational navigation, transparent emergency protocols, and context-aware safety guidance.

Unlike conventional apps that make false claims or fabricate street crime scores, **SafeRoute AI adheres to strict safety ethics**:
- **Zero Hallucinated Crime Data**: When granular micro-level crime datasets are unavailable from municipal authorities, it transparently indicates `"Safety data unavailable"` rather than misleading users with fake danger numbers.
- **Explicit User Consent**: In compliance with web security standards, location coordinates are requested explicitly, and no silent background SMS or calls are falsely promised.
- **One-Click Verified Indian Helplines**: Pre-configured with India's Unified Emergency number **112**, Women Helpline **1091**, Women in Distress **181**, and Cyber Crime **1930**.
- **100% Free & Offline-Ready AI Companion**: A specialized safety AI assistant that operates without requiring any paid API keys, with plug-and-play support for Gemini or OpenAI if configured.

---

## 🏗️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18, Vite 5, JavaScript (ESM), Lucide Icons, Leaflet, React-Leaflet |
| **Backend** | Python 3 Flask, Flask-CORS, Requests, Python-Dotenv |
| **Mapping & Routing** | OpenStreetMap (OSM) Tiles, Open Source Routing Machine (OSRM) API, Nominatim Geocoding |
| **Local Storage** | Client-side `localStorage` for private contact storage (Zero third-party tracking) |
| **Design System** | Dark Navy (`#0a0d18`), Neon Rose Pink (`#ec4899`), Electric Violet (`#9333ea`), Glassmorphism |

---

## 🚀 Key Features

### 1. 🗺️ Safe Route Planner
- **OpenStreetMap & OSRM Integration**: Computes real-time driving or walking corridors with accurate distances in km and travel durations in minutes.
- **Alternative Routes**: Provides selectable primary and alternative routes.
- **Multi-Modal Geocoding**: Search by landmark, use browser GPS location, or enter precise latitude/longitude manually.
- **Transparent Safety Indicator**: Clearly notifies users when micro-corridor crime data is unavailable, providing verified situational checklists instead (high-visibility roads, battery health, check-ins).
- **Nearby Civic Infrastructure**: Visualizes nearby 24/7 Police Outposts and Emergency Hospital casualties along the corridor.
- **Trip Sharing**: One-click formatting to copy or share the journey plan with friends or family.

### 2. 🚨 SOS Emergency Assistance
- **Two-Step Confirmation Guardrail**: Prevents accidental triggers while keeping emergency access immediate.
- **Direct 1-Click Dialing**:
  - `tel:112` – Unified Emergency (Police, Fire, Ambulance)
  - `tel:1091` – 24/7 Women Police Helpline
- **GPS Location Dispatch Generator**:
  - Fetches latitude, longitude, and accuracy radius only upon user authorization.
  - Automatically compiles a structured alert message containing a Google Maps pinpoint link.
  - One-click dispatch via **WhatsApp** (`wa.me`) or **SMS** (`sms:`).
- **Mobile Optimized**: Full-screen emergency command layout designed for high-stress situations.

### 3. 🤖 AI Safety Companion
- **Context-Aware Women's Safety Assistant**:
  - Answers situational travel queries (e.g., *"What to do if cab driver changes route?"*, *"Being followed on foot"*, *"Late night metro precautions"*).
  - Educates on Indian legal rights: **Zero FIR** (filing at any station), **Section 46(4) CrPC / BNSS** (prohibition of women's arrest between sunset and sunrise).
  - Cyber safety protocol (reporting to 1930 and cybercrime.gov.in).
- **Offline Demo Engine**: Operates immediately out-of-the-box with zero API keys required.
- **Extensible LLM Adapter**: Optional `GEMINI_API_KEY` or `OPENAI_API_KEY` support in `backend/.env`.

### 4. 📞 Emergency Helplines & Trusted Contacts
- **Verified National Helplines**:
  - `112` – Unified National Emergency
  - `1091` – Women Helpline (Police)
  - `181` – Women in Distress / Domestic Abuse
  - `1930` – National Cyber Crime Reporting
  - `7827170170` – National Commission for Women (NCW)
  - `108` – Emergency Ambulance
- **Personal Trusted Network**:
  - Add, edit, and delete trusted emergency contacts.
  - Validates 10-digit Indian mobile numbers (`^[6-9]\d{9}$`).
  - Saved strictly in the user's browser `localStorage` for complete data privacy.

### 5. 📚 Practical Safety & Legal Rights Repository
- Categorized guides with actionable checklists:
  - **Solo Travel**
  - **Public Transit**
  - **Cab & Rideshare Safety (4-Point Check)**
  - **Emergency Response**
  - **Women's Legal Rights (India)**
  - **Cyber Safety**

---

## 📂 Project Directory Structure

```text
Hackthon/
├── backend/
│   ├── app.py                      # Flask entry point with CORS & error handlers
│   ├── config.py                   # Configuration & environment variables
│   ├── requirements.txt            # Python dependencies (Flask, CORS, Requests, Dotenv)
│   ├── .env.example                # Environment configuration template
│   ├── routes/
│   │   ├── __init__.py
│   │   └── api_routes.py           # REST endpoints (/api/routes, /api/ai, /api/safety, etc.)
│   └── services/
│       ├── __init__.py
│       ├── routing_service.py      # OSRM routing & Nominatim geocoding
│       ├── safety_service.py       # Transparent safety evaluations & tips database
│       ├── ai_service.py           # Rule-enhanced AI safety assistant & LLM adapter
│       └── emergency_service.py    # Curated Indian emergency helplines
├── frontend/
│   ├── index.html                  # HTML5 entry with Leaflet & Google Fonts
│   ├── package.json                # React, Vite, Leaflet, Lucide dependencies
│   ├── vite.config.js              # Vite server & backend API proxy configuration
│   └── src/
│       ├── main.jsx                # React DOM entry
│       ├── App.jsx                 # App state router & modal orchestrator
│       ├── App.css                 # Responsive components & UI styling
│       ├── index.css               # Design system: Navy, Rose Pink & Purple theme
│       ├── components/
│       │   ├── Navbar.jsx          # Header with logo & pulse SOS button
│       │   ├── Footer.jsx          # Disclaimer, helplines & navigation
│       │   ├── RouteMap.jsx        # Interactive Leaflet map with glowing polyline
│       │   └── SosConfirmationModal.jsx # SOS confirmation & dispatch modal
│       ├── pages/
│       │   ├── Home.jsx            # Landing dashboard & helpline quick bar
│       │   ├── RoutePlanner.jsx    # Start/Destination search, OSRM map & alternatives
│       │   ├── SosEmergency.jsx    # Dedicated SOS emergency command center
│       │   ├── AiSafetyChat.jsx    # AI Safety Companion chatbot interface
│       │   ├── EmergencyContacts.jsx # Helplines & localStorage contacts manager
│       │   └── SafetyTips.jsx      # Categorized practical guides & legal rights
│       └── services/
│           ├── api.js              # Backend REST API client
│           └── storage.js          # LocalStorage manager & SOS message generator
└── README.md                       # Complete documentation & startup guide
```

---

## ⚡ Quick Start Guide (Windows Terminal Commands)

### 1. Start the Flask Backend Server

Open your first Windows PowerShell terminal in this workspace:

```powershell
# Navigate to backend directory
cd C:\Users\sikshapal\OneDrive\Desktop\Hackthon\backend

# Run the Flask backend
python app.py
```

The backend starts at:  
👉 **`http://127.0.0.1:5000`**  
Verify health check: **`http://127.0.0.1:5000/api/health`**

---

### 2. Start the React Frontend Server

Open a second Windows PowerShell terminal:

```powershell
# Navigate to frontend directory
cd C:\Users\sikshapal\OneDrive\Desktop\Hackthon\frontend

# Start Vite development server
npm run dev
```

The frontend starts at:  
👉 **`http://localhost:5173`**

---

## 🌐 Local URLs to Open in Browser

| URL | Description |
|---|---|
| **http://localhost:5173** | **SafeRoute AI Web Application** (Main App) |
| **http://127.0.0.1:5000/api/health** | Backend Health Check & System Status |
| **http://127.0.0.1:5000/api/safety/tips** | Safety Tips & Legal Rights JSON Endpoint |
| **http://127.0.0.1:5000/api/emergency/helplines** | Verified Indian Helplines JSON Endpoint |

---

## 🛡️ Hackathon Evaluation Checklist

- [x] **Complete Working Web Application** (No mock PPT or placeholders).
- [x] **Safe Route Planner**: Leaflet map, distance, travel duration, alternatives, Nominatim geocoding, manual coordinate fallback.
- [x] **SOS Emergency Workflow**: Confirmation dialog, 1-click 112/1091 dialers, WhatsApp & SMS coordinate sharing.
- [x] **AI Safety Companion**: Offline-ready rule-enhanced safety intelligence without paid API keys.
- [x] **Emergency Contacts**: India 112, 1091, 181, 1930, NCW, plus localStorage user contacts with validation.
- [x] **Safety Guidelines**: Solo transit, cab inspections, de-escalation, and Indian legal rights (Zero FIR, Section 46 CrPC).
- [x] **Ethical AI Guarantee**: Never fabricates street crime statistics; clearly displays "Safety data unavailable".
- [x] **Modern UI/UX**: Dark Navy, Purple, and Safety Rose design with responsive mobile layout.


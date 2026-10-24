"""
AI Safety Assistant Service
Provides contextual, empathetic, and tactical women's safety guidance.
Runs in offline rule-enhanced demo mode without requiring paid API keys,
with modular plug-and-play support for Gemini / OpenAI if an API key is configured.
"""

import logging
import os
import re
from config import Config

logger = logging.getLogger(__name__)

DISCLAIMER_TEXT = (
    "Note: SafeRoute AI Assistant provides safety guidance and precautionary tips. "
    "It does not have access to real-time police feeds and CANNOT autonomously dial emergency services for you. "
    "In any urgent or life-threatening situation, immediately call India Emergency 112 or Women Helpline 1091."
)

# Curated knowledge base for context-aware demo responses
KNOWLEDGE_BASE = [
    {
        "intent": "emergency_followed",
        "keywords": ["follow", "stalk", "suspicious", "chase", "behind me", "someone is following", "scared", "shadowing"],
        "urgent": True,
        "response": (
            "⚠️ **IMMEDIATE ACTION PROTOCOL — YOU ARE BEING FOLLOWED:**\n\n"
            "1. **Do NOT head home or enter quiet residential streets.** Keep to crowded, well-illuminated main roads.\n"
            "2. **Cross the street or turn into a busy corner** immediately to confirm whether the person changes direction too.\n"
            "3. **Enter the nearest public, active place** right away: a 24/7 chemist, bank ATM with a guard, petrol bunk, restaurant, or hotel lobby.\n"
            "4. **Loudly notify the staff or surrounding people:** *'Excuse me, I am being followed by someone outside. Please let me stay inside while I call the police.'*\n"
            "5. **Call Emergency 112 immediately** and share your exact location via the SafeRoute AI SOS button.\n"
            "6. Make an audible phone call to a family member or friend describing your exact location and the person's appearance."
        ),
        "suggested_actions": ["Call 112", "Open SOS Assistant", "Share Live Location"]
    },
    {
        "intent": "cab_safety",
        "keywords": ["cab", "taxi", "uber", "ola", "driver", "wrong route", "detour", "ride", "auto"],
        "urgent": False,
        "response": (
            "🚖 **CAB & RIDESHARE SAFETY GUIDELINES:**\n\n"
            "• **Before entering the vehicle:**\n"
            "  - Confirm the license plate number matches the app exactly.\n"
            "  - Ask the driver *'Who are you picking up?'* rather than giving your name first.\n"
            "• **Inside the vehicle:**\n"
            "  - Check that the child-lock on the rear doors is disengaged so you can open the door anytime.\n"
            "  - Follow the live GPS map on your own phone (SafeRoute AI or Maps).\n"
            "• **If the driver takes a wrong or suspicious route:**\n"
            "  - Speak up firmly: *'Bhaiya / Driver, this is not the route shown on my GPS. Please turn back to the main road immediately.'*\n"
            "  - Call a family member or friend on speakerphone: *'Hi, I am in the cab (Vehicle number DL-XX), we just crossed [Landmark]. I have shared the live tracking link.'*\n"
            "  - If they refuse to follow the route, order them to stop at a crowded spot, or trigger the in-app emergency alert / dial 112."
        ),
        "suggested_actions": ["Share Live Route", "Call 112", "Emergency Contacts"]
    },
    {
        "intent": "night_travel",
        "keywords": ["night", "late", "dark", "walking alone", "alone", "midnight", "evening", "travel alone"],
        "urgent": False,
        "response": (
            "🌙 **LATE NIGHT SOLO TRAVEL ADVISORY:**\n\n"
            "1. **Corridor Selection:** Always choose primary arterial roads with active street lamps, even if an unlit alley saves time.\n"
            "2. **Situational Awareness:** Keep at least one ear free if listening to audio. Stay alert to footsteps and vehicular sounds behind you.\n"
            "3. **Battery Management:** Ensure your phone has sufficient battery; switch to battery saver mode if below 30%.\n"
            "4. **Pre-trip Check-in:** Inform a trusted person of your departure time, route, and estimated time of arrival.\n"
            "5. **Transit Stations:** In metro stations or railway platforms, stand near the station master's booth, security personnel, or directly beneath CCTV cameras."
        ),
        "suggested_actions": ["Plan Safe Route", "Check Trusted Contacts", "View Safety Tips"]
    },
    {
        "intent": "public_transit",
        "keywords": ["metro", "bus", "train", "transit", "coach", "compartment", "platform", "conductor"],
        "urgent": False,
        "response": (
            "🚆 **PUBLIC TRANSIT SAFETY PRACTICES:**\n\n"
            "• **Metro Systems:** Board the dedicated women's coach (marked with pink signage in Delhi Metro, Namma Metro, etc.). Locate the emergency passenger alarm / talk-back button inside coaches.\n"
            "• **Buses:** Sit in the designated women's section near the driver or conductor rather than isolated back rows.\n"
            "• **Empty Vehicles:** If a bus or auto is empty or has only male groups acting suspicious, wait for the next scheduled vehicle or choose a registered rideshare.\n"
            "• **Reporting Misconduct:** If anyone touches, photographs, or harasses you, shout out immediately to draw collective attention. Tell the conductor/driver to stop at the nearest police outpost."
        ),
        "suggested_actions": ["View Helplines", "Call 1091 (Women Helpline)"]
    },
    {
        "intent": "legal_rights",
        "keywords": ["legal", "fir", "zero fir", "police", "arrest", "rights", "station", "law", "lawyer", "crpc"],
        "urgent": False,
        "response": (
            "⚖️ **CRITICAL LEGAL RIGHTS FOR WOMEN IN INDIA:**\n\n"
            "1. **Right to Zero FIR:** You can file an FIR at *any* police station across India, regardless of where the incident occurred. Police cannot refuse registration citing territorial jurisdiction.\n"
            "2. **Protection from Sunset to Sunrise (Section 46(4) CrPC / BNSS):** Women cannot be arrested between sunset and sunrise except under extraordinary circumstances, requiring written permission from a Judicial Magistrate.\n"
            "3. **Presence of Female Officers:** A woman can only be searched by a female police officer with strict regard to decency.\n"
            "4. **Right to Virtual / Email Complaints:** Under Delhi Police and state guidelines, women who cannot visit a station in person can submit written or email complaints.\n"
            "5. **Free Legal Aid:** Every woman is entitled to free legal assistance through the Legal Services Authorities (NALSA / DLSA)."
        ),
        "suggested_actions": ["View Legal Tips", "NCW Helpline 7827170170"]
    },
    {
        "intent": "helplines_inquiry",
        "keywords": ["number", "helpline", "call", "police number", "emergency number", "contact", "112", "1091", "181"],
        "urgent": False,
        "response": (
            "📞 **KEY OFFICIAL WOMEN & EMERGENCY HELPLINES IN INDIA:**\n\n"
            "• **112** — All-India Unified Emergency (Police, Fire, Ambulance)\n"
            "• **1091** — 24/7 Dedicated Women Helpline (Emergency police assistance)\n"
            "• **181** — Women in Distress Helpline (Counseling, domestic violence, shelter)\n"
            "• **1930** — National Cyber Crime Helpline (Online harassment & financial fraud)\n"
            "• **7827170170** — National Commission for Women (NCW) 24/7 Helpline\n"
            "• **1098** — Childline (Children & minor safety)\n\n"
            "All helpline calls are toll-free and functional from any mobile network."
        ),
        "suggested_actions": ["Call 112", "Call 1091", "Open Contacts Page"]
    },
    {
        "intent": "cyber_harassment",
        "keywords": ["cyber", "online", "blackmail", "photo", "instagram", "whatsapp", "message", "threat", "leak", "morphed"],
        "urgent": False,
        "response": (
            "🛡️ **CYBER SAFETY & ONLINE HARASSMENT PROTOCOL:**\n\n"
            "1. **Preserve Digital Evidence:** Take clear screenshots of messages, profiles, phone numbers, and URLs immediately before blocking the perpetrator.\n"
            "2. **Do Not Pay or Negotiate:** In blackmail or extortion scenarios, never send money. Complying almost always leads to further demands.\n"
            "3. **Report Immediately:**\n"
            "   - Call **1930** (Cyber Crime Helpline).\n"
            "   - File an official complaint at **cybercrime.gov.in**.\n"
            "4. **Remove Non-Consensual Media:** Utilize StopNCII.org (supported globally and in India) to prevent non-consensual sharing of intimate images using privacy-preserving cryptographic hashes.\n"
            "5. **Block & Lock:** Lock social media profiles and restrict contact information to friends only."
        ),
        "suggested_actions": ["Call 1930", "View Cyber Tips"]
    }
]


def _match_knowledge_base(query):
    """
    Evaluates user input against safety intent patterns.
    """
    clean_q = query.lower()
    
    # Check for urgent/danger signals first
    urgent_signals = ["help", "emergency", "danger", "being followed", "someone is following", "threatened", "kidnap", "attack"]
    is_urgent = any(signal in clean_q for signal in urgent_signals)

    best_match = None
    max_score = 0

    for item in KNOWLEDGE_BASE:
        score = sum(1 for kw in item["keywords"] if kw in clean_q)
        if score > max_score:
            max_score = score
            best_match = item

    if best_match and max_score > 0:
        return best_match
    
    # Generic safety advice fallback
    return {
        "intent": "general_guidance",
        "urgent": is_urgent,
        "response": (
            "Hello! I am your **SafeRoute AI Safety Companion**.\n\n"
            "I can guide you on:\n"
            "• **Safe route navigation & night commute precautions**\n"
            "• **Cab, rideshare & auto safety protocols**\n"
            "• **Immediate tactical steps if followed or feeling unsafe**\n"
            "• **Emergency helplines (112, 1091, 181, 1930)**\n"
            "• **Legal rights for women in India (Zero FIR, arrest guidelines)**\n\n"
            "What situation or question can I assist you with right now?"
        ),
        "suggested_actions": ["Plan Safe Route", "View Emergency Contacts", "Cab Safety Tips"]
    }


def query_ai_assistant(user_message, conversation_history=None):
    """
    Processes chat requests using the offline rule engine,
    or falls back gracefully with full context if an external API key is configured.
    """
    if not user_message or not user_message.strip():
        return {
            "reply": "Please ask a question regarding route safety, travel advice, or emergency steps.",
            "mode": "offline_rule_engine",
            "disclaimer": DISCLAIMER_TEXT
        }

    # If external API is enabled, we could query it; otherwise use the curated offline intelligence
    # Here we check if Gemini API key exists
    api_key = Config.GEMINI_API_KEY
    if api_key:
        try:
            # External Gemini API support if key is provided
            import requests
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
            sys_instruction = (
                "You are SafeRoute AI, an empathetic, highly practical women's safety expert for India. "
                "Provide direct, concise, bulleted safety advice. Emphasize calling 112 in emergencies. "
                "Never invent crime statistics."
            )
            payload = {
                "contents": [
                    {"role": "user", "parts": [{"text": f"{sys_instruction}\n\nUser Question: {user_message}"}]}
                ]
            }
            resp = requests.post(url, json=payload, timeout=6)
            if resp.status_code == 200:
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return {
                    "reply": text,
                    "mode": "gemini_api",
                    "disclaimer": DISCLAIMER_TEXT,
                    "suggested_actions": ["Plan a Route", "SOS Emergency", "Helplines"]
                }
        except Exception as e:
            logger.warning(f"External AI call failed ({str(e)}), falling back to offline rule engine.")

    # Curated offline expert engine
    match = _match_knowledge_base(user_message)
    return {
        "reply": match["response"],
        "intent": match.get("intent", "general"),
        "urgent": match.get("urgent", False),
        "mode": "offline_safety_engine",
        "disclaimer": DISCLAIMER_TEXT,
        "suggested_actions": match.get("suggested_actions", ["Plan a Route", "Helplines", "Safety Tips"])
    }


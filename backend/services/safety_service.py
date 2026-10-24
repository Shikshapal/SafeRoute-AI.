"""
Safety Service
Provides verified, practical safety advice, categorization, legal rights guidance,
and transparent route assessment indicators without fabricating crime data.
"""

SAFETY_TIPS_DATABASE = [
    {
        "id": "tip-solo-1",
        "category": "Solo Travel",
        "title": "Stay on Lit & High-Visibility Corridors",
        "summary": "Choose main thoroughfares and commercial avenues over isolated shortcuts.",
        "content": "Even if an alley or unlit shortcut saves a few minutes, always choose well-lit main roads with open shops, streetlights, and active traffic. High-visibility pathways deter suspicious activity and give you immediate places to seek shelter.",
        "actionable_checklist": [
            "Stick to roads with active commercial establishments",
            "Avoid poorly lit alleys and construction sites at night",
            "Keep one ear open if using earphones to remain alert"
        ],
        "tags": ["walking", "night", "lighting", "roads"]
    },
    {
        "id": "tip-solo-2",
        "category": "Solo Travel",
        "title": "Active Trip Sharing with Trusted Contacts",
        "summary": "Share your live route and estimated arrival time before stepping out.",
        "content": "Before starting your journey, share your live location via SafeRoute AI, WhatsApp, or Google Maps with at least two trusted contacts. Set a check-in time (e.g., 'Will call when I reach Metro Station by 8:30 PM'). If you deviate or stop responding, they know right away.",
        "actionable_checklist": [
            "Send live location link before boarding any vehicle",
            "Keep phone battery above 30% or carry a compact power bank",
            "Agree on a check-in time with family or friends"
        ],
        "tags": ["tracking", "location", "contacts", "checkin"]
    },
    {
        "id": "tip-transit-1",
        "category": "Public Transit",
        "title": "Safe Positioning at Bus Stops and Metro Stations",
        "summary": "Wait near CCTV cameras, station controllers, or designated women compartments.",
        "content": "When waiting for a metro or bus late at night, position yourself directly beneath station lighting, near CCTV surveillance poles, or near official ticketing booths. On metros (such as Delhi Metro, Mumbai Metro, Bengaluru Namma Metro), use the designated women-only coaches whenever available.",
        "actionable_checklist": [
            "Board the designated women's coach when available",
            "Avoid waiting at unlit or deserted corner benches",
            "Note the emergency intercom buttons located inside train coaches"
        ],
        "tags": ["metro", "bus", "public transit", "stations"]
    },
    {
        "id": "tip-transit-2",
        "category": "Public Transit",
        "title": "Late Night Bus & Auto Safety Protocol",
        "summary": "Verify vehicle registration and avoid boarding empty, off-route public vehicles.",
        "content": "Never board an unauthorized private bus or van. In shared autos, avoid seating arrangements where you are pinned between unknown passengers without an immediate exit path. Note the registration number before boarding.",
        "actionable_checklist": [
            "Take a quick photo of the vehicle number plate and message it to family",
            "Sit near the bus driver or conductor rather than rear corners",
            "Ask the driver to stop in a well-lit area if you feel uneasy"
        ],
        "tags": ["bus", "auto", "night transit"]
    },
    {
        "id": "tip-cab-1",
        "category": "Cab & Rideshare",
        "title": "The 4-Point Rideshare Safety Check",
        "summary": "Verify registration, driver photo, child locks, and live GPS route.",
        "content": "Before sitting inside any cab (Ola, Uber, BluSmart, or local taxi), match the license plate, vehicle make, and driver photo with the app. Once inside, check that the rear door child-lock is not engaged. Follow the map on your own phone to detect any unauthorized detour immediately.",
        "actionable_checklist": [
            "Ask 'Who are you picking up?' instead of revealing your name first",
            "Test the door handle before closing to verify child-lock is unlocked",
            "Share ride tracking link via the app or SafeRoute AI message generator",
            "Speak out immediately if the driver deviates from the designated GPS route"
        ],
        "tags": ["cab", "uber", "ola", "rideshare", "taxi"]
    },
    {
        "id": "tip-cab-2",
        "category": "Cab & Rideshare",
        "title": "Verbal Cue & Phone Call Strategy",
        "summary": "Pretend to be on an active call updating someone about the journey.",
        "content": "If you ever feel uncomfortable with a driver's behavior or route choices, place a real or simulated phone call. Speak clearly: 'Hi Dad/Bhai, I just boarded the cab, registration DL-01-XXXX. The driver says we will reach the gate in 15 minutes. Please wait downstairs.' Drivers who hear this know someone is actively expecting you.",
        "actionable_checklist": [
            "State the cab registration number clearly out loud on the call",
            "State your expected arrival time firmly",
            "Do not disclose personal home addresses if dropped off alone; pick a nearby landmark"
        ],
        "tags": ["cab", "phone call", "rideshare", "de-escalation"]
    },
    {
        "id": "tip-emergency-1",
        "category": "Emergency Response",
        "title": "Immediate Actions if You Are Being Followed",
        "summary": "Cross the street, enter a crowded public business, and dial 112.",
        "content": "If you suspect someone is following you on foot or in a vehicle: 1) Cross the street immediately to verify if they change direction too. 2) Do NOT head home into an empty residential lane. 3) Walk straight into an open pharmacy, bank ATM, petrol bunk, restaurant, or supermarket. 4) Loudly inform the staff: 'I am being followed, please help me call the police'.",
        "actionable_checklist": [
            "Cross the street or turn a corner to confirm if you are indeed being followed",
            "Never lead a pursuer towards your home or secluded alleyway",
            "Head into 24/7 commercial stores, hospital lobbies, or well-lit petrol pumps",
            "Dial 112 immediately and keep your SafeRoute AI SOS prompt ready"
        ],
        "tags": ["stalking", "followed", "emergency", "urgent"]
    },
    {
        "id": "tip-legal-1",
        "category": "Women's Legal Rights (India)",
        "title": "Right to Zero FIR",
        "summary": "You can lodge an FIR at any police station regardless of jurisdiction.",
        "content": "Under Indian Law, a woman can lodge a 'Zero FIR' at any police station across the country, regardless of where the incident occurred or whether that station holds geographical jurisdiction. The receiving station is legally mandated to register the complaint and transfer it to the concerned police station without delay.",
        "actionable_checklist": [
            "A police officer cannot refuse to register an FIR claiming 'out of jurisdiction'",
            "Ask specifically for a 'Zero FIR' if a station resists filing",
            "Obtain a signed, stamped copy of the FIR free of charge"
        ],
        "tags": ["legal", "zero fir", "police", "rights", "india"]
    },
    {
        "id": "tip-legal-2",
        "category": "Women's Legal Rights (India)",
        "title": "Arrest Regulations & Search Protections",
        "summary": "Prohibition of arrest of women between sunset and sunrise without magistrate order.",
        "content": "According to Section 46(4) of the Code of Criminal Procedure (CrPC) / Bharatiya Nagarik Suraksha Sanhita (BNSS), no woman can be arrested after sunset and before sunrise except under exceptional circumstances and only with prior permission of a Judicial Magistrate. Furthermore, only a female police officer can conduct a physical search of a woman.",
        "actionable_checklist": [
            "Arrests between 6 PM and 6 AM require a prior written Magistrate order",
            "Female police officers must be present during search or custody",
            "Women have the right to free legal representation at the police station"
        ],
        "tags": ["crpc", "legal rights", "arrest", "police guidelines"]
    },
    {
        "id": "tip-cyber-1",
        "category": "Cyber Safety",
        "title": "Protecting Location Privacy & Reporting Online Harassment",
        "summary": "Never post live location stories publicly; report cyber harassment to 1930.",
        "content": "Avoid broadcasting your real-time whereabouts on public social media stories (e.g., Instagram, Snapchat). Share location coordinates only with verified personal contacts via direct end-to-end encrypted messaging. If harassed online, take immediate screenshots preserving timestamps and usernames, and report to the National Cyber Crime Reporting Portal or call 1930.",
        "actionable_checklist": [
            "Post travel photos and check-ins after leaving the venue, not during",
            "Take screenshots of abusive messages including phone numbers or handles",
            "Dial 1930 for urgent cyber fraud and harassment support"
        ],
        "tags": ["cyber", "privacy", "online", "1930"]
    }
]


def get_all_safety_tips(category_filter=None):
    """
    Returns safety tips, optionally filtered by category.
    """
    if category_filter and category_filter != "All":
        filtered = [t for t in SAFETY_TIPS_DATABASE if t["category"].lower() == category_filter.lower()]
        return filtered
    return SAFETY_TIPS_DATABASE


def get_safety_categories():
    """
    Returns unique categories available in the safety tips database.
    """
    categories = set(t["category"] for t in SAFETY_TIPS_DATABASE)
    return sorted(list(categories))


def evaluate_route_safety(distance_meters, duration_seconds, waypoints_count, travel_mode="driving"):
    """
    Generates a transparent safety advisory for a planned route.
    ETHICAL REQUIREMENT: Never invent false crime statistics or fake safety scores.
    If verified micro-level street crime data is not available, explicitly state so.
    """
    distance_km = round(distance_meters / 1000.0, 2)
    duration_mins = round(duration_seconds / 60.0)

    # General navigation considerations
    advisories = [
        "Plan your arrival before late night hours if traveling through unfamiliar localities.",
        "Check that your phone has sufficient battery charge (>30%) for navigation and emergency access.",
        "Share your estimated journey duration with a trusted family member or friend."
    ]

    if travel_mode == "walking":
        advisories.append("Walking mode selected: Stay on main lighted sidewalks and avoid isolated underpasses.")
    else:
        advisories.append("Vehicle mode selected: Verify vehicle doors and follow live navigation checkpoints.")

    return {
        "verified_crime_data_status": "Safety data unavailable",
        "is_micro_crime_data_available": False,
        "transparency_notice": (
            "Verified street-level safety datasets are not currently published by municipal authorities "
            "for this micro-corridor. SafeRoute AI never invents or fabricates fake crime scores. "
            "Please follow standard situational awareness and precaution guidelines."
        ),
        "distance_km": distance_km,
        "duration_minutes": duration_mins,
        "travel_mode": travel_mode,
        "recommended_precautions": advisories,
        "emergency_reminder": "In any urgent situation along this route, immediately call India Emergency 112."
    }


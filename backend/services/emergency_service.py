"""
Emergency Service
Provides verified Indian national and state emergency helplines,
their descriptions, dial protocols, and categories.
"""

def get_verified_helplines():
    """
    Returns curated, verified emergency helpline numbers in India.
    """
    return [
        {
            "id": "unified-112",
            "name": "National Emergency Number",
            "number": "112",
            "tel_uri": "tel:112",
            "category": "All-in-One Emergency",
            "description": "Unified emergency response support system for police, fire, medical emergencies across all Indian states and Union Territories.",
            "priority": "HIGH",
            "is_national": True,
            "badge": "Primary 24/7"
        },
        {
            "id": "women-1091",
            "name": "Women Helpline (General)",
            "number": "1091",
            "tel_uri": "tel:1091",
            "category": "Women Safety",
            "description": "Toll-free 24/7 helpline dedicated to women experiencing harassment, threat, or seeking immediate police intervention.",
            "priority": "HIGH",
            "is_national": True,
            "badge": "24/7 Toll-Free"
        },
        {
            "id": "women-distress-181",
            "name": "Women in Distress Helpline",
            "number": "181",
            "tel_uri": "tel:181",
            "category": "Women Safety & Crisis",
            "description": "Support for women facing domestic violence, abuse, mental distress, or seeking shelter and counseling.",
            "priority": "MEDIUM",
            "is_national": True,
            "badge": "Support & Shelter"
        },
        {
            "id": "cybercrime-1930",
            "name": "National Cyber Crime Helpline",
            "number": "1930",
            "tel_uri": "tel:1930",
            "category": "Cyber Safety",
            "description": "Report cyber stalking, online harassment, non-consensual media sharing, and financial cyber frauds immediately.",
            "priority": "MEDIUM",
            "is_national": True,
            "badge": "Cyber Cell"
        },
        {
            "id": "ncw-helpline",
            "name": "NCW 24/7 Women Helpline",
            "number": "7827170170",
            "tel_uri": "tel:7827170170",
            "category": "Legal & Crisis Support",
            "description": "National Commission for Women round-the-clock helpline for women in distress and legal guidance.",
            "priority": "MEDIUM",
            "is_national": True,
            "badge": "NCW Govt"
        },
        {
            "id": "ambulance-108",
            "name": "Ambulance / Medical Emergency",
            "number": "108",
            "tel_uri": "tel:108",
            "category": "Medical Emergency",
            "description": "Disaster medical management and urgent ambulance dispatch across multiple Indian states.",
            "priority": "MEDIUM",
            "is_national": True,
            "badge": "Medical"
        },
        {
            "id": "childline-1098",
            "name": "Childline India",
            "number": "1098",
            "tel_uri": "tel:1098",
            "category": "Child Protection",
            "description": "24-hour nationwide helpline for children and young girls in need of care and protection.",
            "priority": "LOW",
            "is_national": True,
            "badge": "Children & Minors"
        }
    ]


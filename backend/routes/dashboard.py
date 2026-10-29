from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models.attack_model import get_all_attacks
from database import db

dashboard = Blueprint("dashboard", __name__)

@dashboard.route("/dashboard", methods=["GET"])
@jwt_required(optional=True)
def get_dashboard():
    attacks = get_all_attacks()

    active_count = len(attacks)
    today_count  = len(attacks)

    has_critical = any(a.get("severity") == "Critical" for a in attacks)
    has_high     = any(a.get("severity") == "High" for a in attacks)

    threat_level = "HIGH"
    if has_critical:
        threat_level = "CRITICAL"
    elif not has_high and not attacks:
        threat_level = "NORMAL"

    # Ping real MongoDB database to verify connection health
    db_status = "Connected"
    try:
        db.command("ping")
    except Exception:
        db_status = "Disconnected"

    data = {
        "stats": {
            "threatLevel": threat_level,
            "activeThreats": active_count,
            "todayAlerts": today_count,
            "aiConfidence": "98%"
        },
        "systemStatus": [
            { "title": "AI Engine", "status": "Running" },
            { "title": "Firewall",  "status": "Enabled" },
            { "title": "Backend",   "status": "Online" },
            { "title": "Database",  "status": db_status }
        ],
        "attacks": attacks
    }

    return jsonify(data), 200
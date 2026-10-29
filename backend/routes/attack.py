from flask import Blueprint, request, jsonify
from models.attack_model import save_attack, get_all_attacks

attack = Blueprint("attack", __name__)


@attack.route("/log_attack", methods=["POST"])
def log_attack():
    data = request.json or {}
    if not data.get("ip_address") and not data.get("ip"):
        from routes.lab import get_client_ip
        client_ip = get_client_ip()
        data["ip_address"] = client_ip
        data["ip"] = client_ip

    save_attack(data)

    return jsonify({
        "message": "Attack Logged"
    })


@attack.route("/attacks", methods=["GET"])
def attacks():
    return jsonify(
        get_all_attacks()
    )

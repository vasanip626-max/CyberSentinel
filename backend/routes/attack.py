from flask import Blueprint, request, jsonify
from models.attack_model import save_attack, get_all_attacks

attack = Blueprint("attack", __name__)


@attack.route("/log_attack", methods=["POST"])
def log_attack():

    data = request.json

    save_attack(data)

    return jsonify({

        "message": "Attack Logged"

    })


@attack.route("/attacks", methods=["GET"])
def attacks():

    return jsonify(

        get_all_attacks()

    )
from database.db import db
from datetime import datetime

attack_logs = db["attack_logs"]


def save_attack(
    attack_type,
    severity,
    ip_address,
    employee_id,
    description
):

    attack_logs.insert_one({

        "attack_type": attack_type,

        "severity": severity,

        "ip_address": ip_address,

        "employee_id": employee_id,

        "description": description,

        "status": "Detected",

        "time": datetime.now()

    })
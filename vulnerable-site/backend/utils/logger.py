from pymongo import MongoClient
from datetime import datetime
from config import MONGO_URI, DATABASE_NAME

client = MongoClient(MONGO_URI)

db = client[DATABASE_NAME]

attackCollection = db["attack_logs"]


def saveAttack(
    attack,
    ip,
    severity,
    status,
    email="Unknown"
):

    attackCollection.insert_one({

        "time": datetime.now().strftime("%d-%m-%Y %H:%M:%S"),

        "email": email,

        "ip": ip,

        "attack": attack,

        "severity": severity,

        "status": status

    })
from pymongo import MongoClient
from config import Config

client = MongoClient(Config.MONGO_URI)

# Main CyberSentinel Database
db = client[Config.DATABASE_NAME]

users_collection = db["users"]
logs_collection = db["logs"]
reports_collection = db["reports"]
attack_collection = db["attacks"]

# Vulnerable NovaSoft Lab Database
novasoft_db = client["novasoft"]
novasoft_users_collection = novasoft_db["users"]
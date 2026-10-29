from pymongo import MongoClient
from config import MONGO_URI, DATABASE_NAME

print("Connected Database:", DATABASE_NAME)

client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]

users = db["users"]
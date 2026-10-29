import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://vasanip626_db_user:125jkelNDbliMJ1o@cluster0.gqtmlcb.mongodb.net/?retryWrites=true&w=majority")
    DATABASE_NAME = os.getenv("DATABASE_NAME", "cybersentinel")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "CyberSentinel@2026")
    SECRET_KEY = os.getenv("SECRET_KEY", "CyberSentinelSecret")
    
    # SMTP Configuration for Fast Password Reset OTP Delivery
    SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
    SMTP_USER = os.getenv("SMTP_USER", "cybersentinel338@gmail.com")
    SMTP_PASS = os.getenv("SMTP_PASS", "wfabqzrcrlzinvpl")
    
    # HTTPS Transactional Email APIs (Port 443 - Bypasses Render Free Tier SMTP Blocks)
    RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
    BREVO_API_KEY = os.getenv("BREVO_API_KEY", "")

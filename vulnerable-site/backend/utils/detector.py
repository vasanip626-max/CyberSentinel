from flask import Blueprint, request, jsonify
from models.user import create_user, get_user
from config import SECRET_KEY
from utils.logger import saveAttack
from utils.detector import detectSQLInjection

import bcrypt
import jwt
import datetime

auth = Blueprint("auth", __name__)


# ==========================================================
# Register
# ==========================================================

@auth.route("/register", methods=["POST"])
def register():

    data = request.json

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:

        return jsonify({

            "message": "All fields are required."

        }), 400

    existing_user = get_user(email)

    if existing_user:

        return jsonify({

            "message": "Email already exists."

        }), 409

    hashed_password = bcrypt.hashpw(

        password.encode("utf-8"),

        bcrypt.gensalt()

    ).decode("utf-8")

    user = {

        "name": name,
        "email": email,
        "password": hashed_password

    }

    create_user(user)

    return jsonify({

        "message": "Registration Successful"

    }), 201


# ==========================================================
# Login
# ==========================================================

@auth.route("/login", methods=["POST"])
def login():

    data = request.json

    email = data.get("email")
    password = data.get("password")

    # =====================================================
    # SQL Injection Detection
    # =====================================================

    if detectSQLInjection(email):

        saveAttack(

            "SQL Injection Attempt",

            request.remote_addr,

            "Critical",

            "Blocked",

            email

        )

        return jsonify({

            "message": "Suspicious request detected."

        }), 403

    if detectSQLInjection(password):

        saveAttack(

            "SQL Injection Attempt",

            request.remote_addr,

            "Critical",

            "Blocked",

            email

        )

        return jsonify({

            "message": "Suspicious request detected."

        }), 403

    # =====================================================
    # Find User
    # =====================================================

    user = get_user(email)

    if not user:

        saveAttack(

            "Invalid Login",

            request.remote_addr,

            "Medium",

            "Blocked",

            email

        )

        return jsonify({

            "message": "Invalid Email or Password"

        }), 401

    # =====================================================
    # Password Check
    # =====================================================

    if not bcrypt.checkpw(

        password.encode("utf-8"),

        user["password"].encode("utf-8")

    ):

        saveAttack(

            "Wrong Password",

            request.remote_addr,

            "Medium",

            "Blocked",

            email

        )

        return jsonify({

            "message": "Invalid Email or Password"

        }), 401

    # =====================================================
    # Successful Login
    # =====================================================

    saveAttack(

        "Normal Login",

        request.remote_addr,

        "Low",

        "Allowed",

        email

    )

    token = jwt.encode(

        {

            "id": str(user["_id"]),

            "email": user["email"],

            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)

        },

        SECRET_KEY,

        algorithm="HS256"

    )

    return jsonify({

        "message": "Login Successful",

        "token": token,

        "user": {

            "name": user["name"],

            "email": user["email"]

        }

    }), 200
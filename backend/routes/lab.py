from flask import Blueprint, request, jsonify
import bcrypt
from datetime import datetime
from database import novasoft_db
from bson.objectid import ObjectId
from models.attack_model import save_attack

lab = Blueprint("lab", __name__)

def get_client_ip():
    """Extract real client IP behind reverse proxies like Render / Vercel."""
    cf = request.headers.get("CF-Connecting-IP")
    if cf and cf.strip():
        return cf.strip()
    xff = request.headers.get("X-Forwarded-For")
    if xff:
        parts = [p.strip() for p in xff.split(",") if p.strip()]
        if parts:
            return parts[0]
    real_ip = request.headers.get("X-Real-IP")
    if real_ip and real_ip.strip():
        return real_ip.strip()
    return request.remote_addr or "127.0.0.1"

# NovaSoft lab users stored in dedicated 'novasoft' database -> 'users' & 'employees' collections
lab_users = novasoft_db["users"]
lab_employees_coll = novasoft_db["employees"]

INITIAL_EMPLOYEES = [
    { "id": "1", "fullName": "John Smith",    "firstName": "John", "lastName": "Smith",   "role": "HR Manager",            "company": "HR",               "dept": "HR",          "department": "HR",          "email": "john@novasoft.com",   "phone": "9876543210", "salary": "₹8,50,000", "address": "New York",  "status": "Online" },
    { "id": "2", "fullName": "Emily Johnson", "firstName": "Emily", "lastName": "Johnson", "role": "Financial Analyst",     "company": "Finance",          "dept": "Finance",     "department": "Finance",     "email": "emily@novasoft.com",  "phone": "9876543211", "salary": "₹9,20,000", "address": "Chicago",   "status": "Away" },
    { "id": "3", "fullName": "Rahul Sharma",  "firstName": "Rahul", "lastName": "Sharma",  "role": "Branch Manager",        "company": "Operations",       "dept": "Operations",  "department": "Operations",  "email": "rahul.sharma@novasoft.io", "phone": "9876543212", "salary": "₹12,50,000", "address": "Mumbai",    "status": "Active" },
    { "id": "4", "fullName": "Priya Patel",   "firstName": "Priya", "lastName": "Patel",   "role": "Senior Loan Officer",   "company": "Loans",            "dept": "Loans",       "department": "Loans",       "email": "priya.patel@novasoft.io",  "phone": "9876543213", "salary": "₹10,80,000", "address": "Delhi",     "status": "Active" },
    { "id": "5", "fullName": "Arjun Mehta",   "firstName": "Arjun", "lastName": "Mehta",   "role": "Cybersecurity Analyst", "company": "IT Security",     "dept": "IT Security", "department": "IT Security", "email": "arjun.mehta@novasoft.io",  "phone": "9876543214", "salary": "₹14,00,000", "address": "Bangalore", "status": "Active" },
    { "id": "6", "fullName": "Sneha Reddy",   "firstName": "Sneha", "lastName": "Reddy",   "role": "Relationship Manager",  "company": "Retail",           "dept": "Retail",      "department": "Retail",      "email": "sneha.reddy@novasoft.io",  "phone": "9876543215", "salary": "₹8,80,000", "address": "Hyderabad", "status": "Active" },
    { "id": "7", "fullName": "Vasanip Admin", "firstName": "Vasanip", "lastName": "User",  "role": "Security Analyst",      "company": "CyberSentinel",   "dept": "Security",    "department": "Security",    "email": "vasanip626@gmail.com", "phone": "9876543219", "salary": "₹15,00,000", "address": "Mumbai",   "status": "Active" }
]

def seed_employees_if_needed():
    default_hashed_pass = bcrypt.hashpw("password123".encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    for emp in INITIAL_EMPLOYEES:
        if not lab_users.find_one({"email": emp["email"]}) and not lab_employees_coll.find_one({"email": emp["email"]}):
            emp_data = dict(emp)
            emp_data["password"] = default_hashed_pass
            emp_data["createdAt"] = datetime.utcnow().isoformat()
            lab_users.insert_one(emp_data)
        else:
            lab_users.update_many({"email": emp["email"]}, {"$set": {"salary": emp["salary"], "id": emp["id"], "password": default_hashed_pass}})
            lab_employees_coll.update_many({"email": emp["email"]}, {"$set": {"salary": emp["salary"], "id": emp["id"], "password": default_hashed_pass}})

    # Seed Master Administrator Account
    admin_hash = bcrypt.hashpw("Admin@123".encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    lab_users.update_one(
        {"email": "admin@gmail.com"},
        {"$set": {
            "fullName": "System Administrator",
            "firstName": "System",
            "lastName": "Admin",
            "role": "Admin",
            "company": "NovaSoft Enterprise",
            "plan": "Enterprise",
            "password": admin_hash
        }},
        upsert=True
    )

try:
    seed_employees_if_needed()
except Exception as e:
    print("Seed employees check warning:", e)


# ===========================
# LAB REGISTER
# ===========================

@lab.route("/lab/register", methods=["POST"])
def lab_register():
    data = request.get_json(silent=True) or {}

    def clean_str(val):
        if isinstance(val, dict):
            val = val.get("value") or val.get("name") or (list(val.values())[0] if val else "")
        return str(val or "").strip()

    name_str   = clean_str(data.get("fullName") or data.get("name"))
    first_name = clean_str(data.get("firstName"))
    last_name  = clean_str(data.get("lastName"))

    if not first_name and name_str:
        parts = name_str.split(" ")
        first_name = parts[0]
        last_name  = " ".join(parts[1:]) if len(parts) > 1 else "User"

    if not last_name:
        last_name = "User"

    email    = clean_str(data.get("email")).lower()
    phone    = clean_str(data.get("phone"))
    role     = clean_str(data.get("role"))
    company  = clean_str(data.get("company"))
    password = str(data.get("password") or "")

    if not all([first_name, email, password]):
        return jsonify({"message": "Required fields missing"}), 400

    if lab_users.find_one({"email": email}):
        return jsonify({"message": "Email already registered"}), 409

    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    user = {
        "firstName": first_name,
        "lastName":  last_name,
        "fullName":  f"{first_name} {last_name}",
        "name":      f"{first_name} {last_name}",
        "email":     email,
        "phone":     phone or "9876543210",
        "role":      role or "Developer",
        "company":   company or "NovaSoft",
        "dept":      company or "Engineering",
        "department": company or "Engineering",
        "salary":    "₹8,50,000",
        "address":   "Bangalore",
        "password":  hashed,
        "plan":      "Starter",
        "status":    "Active",
        "location":  "Bangalore",
        "createdAt": datetime.utcnow().isoformat()
    }

    lab_users.insert_one(user)

    return jsonify({"message": "Account created successfully! Please sign in."}), 201


# ===========================
# LAB LOGIN & BRUTE FORCE DETECTION
# ===========================

@lab.route("/lab/login", methods=["POST"])
def lab_login():
    data = request.get_json(silent=True) or {}

    email_raw = data.get("email", "")
    if isinstance(email_raw, dict):
        email_raw = email_raw.get("email", "") or email_raw.get("value", "")

    email = str(email_raw or "").strip().lower()

    password_raw = data.get("password", "")
    if isinstance(password_raw, dict):
        password_raw = password_raw.get("password", "") or password_raw.get("value", "")

    password = str(password_raw or "")

    failed_attempts = novasoft_db["failed_logins"]

    def log_failed_login(user_email):
        try:
            ip = get_client_ip()
            doc = failed_attempts.find_one({"ip": ip, "email": user_email})
            count = (doc.get("count", 0) + 1) if doc else 1
            failed_attempts.update_one({"ip": ip, "email": user_email}, {"$set": {"count": count}}, upsert=True)

            if count >= 3:
                save_attack({
                    "attack_type": "Brute Force",
                    "severity": "High",
                    "ip_address": ip,
                    "target_user": user_email,
                    "actor_user": user_email,
                    "description": f"Brute Force Attempt: {count} consecutive failed login attempts for '{user_email}'",
                    "status": "Detected",
                    "timestamp": datetime.now()
                })
        except Exception as e:
            print("Failed login logging error:", e)

    # Dedicated Administrator Account Authentication
    if email == "admin@gmail.com":
        if password == "Admin@123":
            failed_attempts.delete_many({"ip": get_client_ip(), "email": email})
            return jsonify({
                "message": "Admin login successful",
                "user": {
                    "id": "ADMIN_001",
                    "fullName": "System Administrator",
                    "firstName": "System",
                    "lastName": "Admin",
                    "email": "admin@gmail.com",
                    "role": "Admin",
                    "company": "NovaSoft Enterprise",
                    "plan": "Enterprise"
                }
            }), 200
        else:
            log_failed_login(email)
            return jsonify({"message": "Invalid email or password"}), 401

    user = lab_users.find_one({"email": email})

    if not user:
        log_failed_login(email)
        return jsonify({"message": "Invalid email or password"}), 401

    user_pass = user.get("password")

    if not user_pass:
        if password not in ["password123", "password", "admin"]:
            log_failed_login(email)
            return jsonify({"message": "Invalid email or password"}), 401
    else:
        try:
            if not bcrypt.checkpw(password.encode("utf-8"), user_pass.encode("utf-8")):
                log_failed_login(email)
                return jsonify({"message": "Invalid email or password"}), 401
        except Exception:
            if password != user_pass:
                log_failed_login(email)
                return jsonify({"message": "Invalid email or password"}), 401

    failed_attempts.delete_many({"ip": get_client_ip(), "email": email})

    return jsonify({
        "message": "Login successful",
        "user": {
            "id":        str(user.get("_id", user.get("id", ""))),
            "fullName":  user.get("fullName", user.get("name", "")),
            "firstName": user.get("firstName", ""),
            "email":     user["email"],
            "role":      user.get("role", ""),
            "company":   user.get("company", "NovaSoft"),
            "plan":      user.get("plan", "Starter")
        }
    }), 200


# ===========================
# LAB EMPLOYEES / SEARCH (SQLi & XSS Detection)
# ===========================

@lab.route("/lab/employees", methods=["GET"])
@lab.route("/employees", methods=["GET"])
def lab_employees():
    q = request.args.get("q", "").strip()

    if q:
        q_lower = q.lower()
        ip_addr = get_client_ip()

        # 1. SQL Injection (SQLi) Detection
        sqli_keywords = ["'", "or ", "union", "select", "drop", "--", ";", "1=1", "1'='1"]
        is_sqli = any(kw in q_lower for kw in sqli_keywords)
        if is_sqli:
            save_attack({
                "attack_type": "SQL Injection",
                "severity": "Critical",
                "ip_address": ip_addr,
                "target_user": "novasoft_db.employees",
                "actor_user": request.headers.get("X-User-Email") or "Anonymous/Attacker",
                "description": f"SQL Injection Payload Detected: Query param 'q={q}' in employee search endpoint",
                "status": "Blocked",
                "timestamp": datetime.now()
            })
            print(f"[SQLi DETECTED] Query payload '{q}' from IP {ip_addr}")

        # 2. Reflected Cross-Site Scripting (XSS) Detection
        xss_keywords = ["<script", "javascript:", "onerror=", "onload=", "<img", "alert(", "<svg", "<iframe"]
        is_xss = any(kw in q_lower for kw in xss_keywords)
        if is_xss:
            save_attack({
                "attack_type": "XSS Attack",
                "severity": "High",
                "ip_address": ip_addr,
                "target_user": "Search Output DOM",
                "actor_user": request.headers.get("X-User-Email") or "Anonymous/Attacker",
                "description": f"Cross-Site Scripting (XSS) Vector Detected: Parameter 'q={q}'",
                "status": "Detected",
                "timestamp": datetime.now()
            })
            print(f"[XSS DETECTED] Script vector '{q}' from IP {ip_addr}")

        if is_sqli or is_xss:
            # Vulnerable loop hole: SQL injection bypasses search filter and returns all records; XSS returns directory
            users = list(lab_employees_coll.find({}, {"password": 0})) + list(lab_users.find({}, {"password": 0}))
        else:
            try:
                import re
                regex = {"$regex": re.escape(q), "$options": "i"}
                query_filter = {
                    "$or": [
                        {"fullName": regex},
                        {"firstName": regex},
                        {"lastName": regex},
                        {"name": regex},
                        {"role": regex},
                        {"company": regex},
                        {"dept": regex},
                        {"department": regex},
                        {"email": regex},
                        {"phone": regex},
                        {"location": regex},
                        {"address": regex}
                    ]
                }
                users = list(lab_employees_coll.find(query_filter, {"password": 0})) + list(lab_users.find(query_filter, {"password": 0}))
            except Exception:
                users = list(lab_employees_coll.find({}, {"password": 0})) + list(lab_users.find({}, {"password": 0}))
    else:
        users = list(lab_employees_coll.find({}, {"password": 0})) + list(lab_users.find({}, {"password": 0}))

    seen_emails = set()
    formatted = []
    for idx, u in enumerate(users):
        email_val = u.get("email", "").lower()
        if email_val in seen_emails:
            continue
        if email_val:
            seen_emails.add(email_val)

        full_n = u.get("fullName") or u.get("name") or f"{u.get('firstName', '')} {u.get('lastName', '')}".strip() or u.get("email", "")
        sal = u.get("salary") or "₹8,50,000"
        if str(sal).startswith("$"):
            sal = sal.replace("$", "₹")

        formatted.append({
            "id": str(u.get("id") or u.get("_id", idx + 1)),
            "name": full_n,
            "fullName": full_n,
            "firstName": u.get("firstName", ""),
            "lastName": u.get("lastName", ""),
            "email": u.get("email", ""),
            "role": u.get("role") or u.get("dept") or "Employee",
            "dept": u.get("department") or u.get("dept") or u.get("company") or "HR",
            "department": u.get("department") or u.get("dept") or u.get("company") or "HR",
            "phone": u.get("phone") or "9876543210",
            "salary": sal,
            "address": u.get("address") or u.get("location") or "New York",
            "location": u.get("address") or u.get("location") or "New York",
            "status": u.get("status") or "Online"
        })

    return jsonify(formatted), 200


# ===========================
# GET SINGLE EMPLOYEE DETAILS (IDOR Detection)
# ===========================

@lab.route("/lab/employee/<emp_id>", methods=["GET"])
@lab.route("/lab/employees/<emp_id>", methods=["GET"])
@lab.route("/employee/<emp_id>", methods=["GET"])
@lab.route("/employees/<emp_id>", methods=["GET"])
def lab_get_employee(emp_id):
    emp_str = str(emp_id).strip()

    logged_email = (request.headers.get("X-User-Email") or request.args.get("user_email") or "").strip().lower()
    logged_id = (request.headers.get("X-User-Id") or request.args.get("user_id") or "").strip()

    user = None

    user = lab_employees_coll.find_one({"id": emp_str}, {"password": 0})
    if not user and emp_str.isdigit():
        user = lab_employees_coll.find_one({"id": int(emp_str)}, {"password": 0})

    if not user:
        user = lab_users.find_one({"id": emp_str}, {"password": 0})
    if not user and emp_str.isdigit():
        user = lab_users.find_one({"id": int(emp_str)}, {"password": 0})

    if not user and len(emp_str) == 24:
        try:
            user = lab_employees_coll.find_one({"_id": ObjectId(emp_str)}, {"password": 0}) or \
                   lab_users.find_one({"_id": ObjectId(emp_str)}, {"password": 0})
        except Exception:
            pass

    if not user:
        user = lab_employees_coll.find_one({"email": emp_str}, {"password": 0}) or \
               lab_users.find_one({"email": emp_str}, {"password": 0})

    if not user and emp_str.isdigit():
        idx = int(emp_str) - 1
        all_emps = list(lab_employees_coll.find({}, {"password": 0})) + list(lab_users.find({}, {"password": 0}))
        if 0 <= idx < len(all_emps):
            user = all_emps[idx]

    if not user:
        return jsonify({"message": "Employee not found"}), 404

    target_email = (user.get("email") or "").strip().lower()
    target_id = str(user.get("id") or user.get("_id", emp_str))

    is_unauthorized = False

    if logged_email and target_email and logged_email != target_email:
        is_unauthorized = True
    elif logged_id and target_id and logged_id != target_id:
        is_unauthorized = True
    elif not logged_email and not logged_id and emp_str not in ["1", "2", "3"]:
        is_unauthorized = True

    if is_unauthorized:
        actor_identity = logged_email or logged_id or "Anonymous/Attacker"
        attack_data = {
            "attack_type": "IDOR",
            "severity": "High",
            "ip_address": get_client_ip(),
            "employee_id": target_id,
            "target_user": target_email,
            "actor_user": actor_identity,
            "description": f"IDOR Vulnerability Attempt: User '{actor_identity}' accessed employee record of '{target_email or emp_str}'",
            "status": "Detected",
            "timestamp": datetime.now()
        }
        try:
            save_attack(attack_data)
            print(f"[IDOR DETECTED] User '{actor_identity}' accessed target '{target_email}' (ID: {target_id})")
        except Exception as e:
            print("Error logging IDOR attack:", e)

    full_name = user.get("fullName") or user.get("name") or f"{user.get('firstName', '')} {user.get('lastName', '')}".strip() or user.get("email", "")

    sal = user.get("salary") or "₹8,50,000"
    if str(sal).startswith("$"):
        sal = str(sal).replace("$", "₹")

    return jsonify({
        "id": target_id,
        "name": full_name,
        "fullName": full_name,
        "firstName": user.get("firstName", ""),
        "lastName": user.get("lastName", ""),
        "email": user.get("email", ""),
        "department": user.get("department") or user.get("dept") or user.get("company") or "HR",
        "dept": user.get("department") or user.get("dept") or user.get("company") or "HR",
        "role": user.get("role") or "Employee",
        "phone": user.get("phone") or "9876543210",
        "salary": sal,
        "address": user.get("address") or user.get("location") or "New York",
        "status": user.get("status") or "Online"
    }), 200


# ===========================
# LAB USERS LIST (Admin)
# ===========================

@lab.route("/lab/users", methods=["GET"])
def lab_users_list():
    users = list(lab_users.find({}, {"password": 0, "_id": 0}))
    return jsonify({"users": users, "total": len(users)}), 200


# ===========================
# LAB HEALTH CHECK
# ===========================

@lab.route("/lab/health", methods=["GET"])
def lab_health():
    return jsonify({
        "status":  "Running",
        "service": "NovaSoft Lab",
        "db":      "MongoDB Connected (novasoft)"
    }), 200


# ===========================
# LAB CSRF PASSWORD CHANGE (CSRF Detection)
# ===========================

@lab.route("/lab/change-password", methods=["POST", "GET"])
@lab.route("/change-password", methods=["POST", "GET"])
def lab_csrf_change_password():
    new_password = request.args.get("password") or (request.get_json(silent=True) or {}).get("password")
    user_email   = request.args.get("email") or request.headers.get("X-User-Email") or "john@novasoft.com"

    save_attack({
        "attack_type": "CSRF Threat",
        "severity": "Medium",
        "ip_address": get_client_ip(),
        "target_user": user_email,
        "actor_user": "Cross-Site Origin Attacker",
        "description": f"CSRF Request Forgery Attempt: Unauthorized password change initiated for '{user_email}' without CSRF Token",
        "status": "Detected",
        "timestamp": datetime.now()
    })
    print(f"[CSRF DETECTED] Password change triggered for '{user_email}' without Anti-CSRF token")

    return jsonify({"message": "Password changed successfully (CSRF Vulnerable)"}), 200

from flask import Blueprint, request, jsonify
from datetime import datetime, timezone, timedelta

IST = timezone(timedelta(hours=5, minutes=30))

ai_bp = Blueprint("ai", __name__)

CHATBOT_KNOWLEDGE = {
    "idor": {
        "name": "Insecure Direct Object Reference (IDOR)",
        "severity": "High Priority (OWASP A01:2021)",
        "overview": "IDOR occurs when an application uses user-supplied input (such as `/lab/employee/2`) to access database objects directly without verifying if the authenticated user has permission to view that resource.",
        "mechanism": "An attacker logs into an unprivileged account and changes resource identifiers in URLs, headers, or API request parameters to manipulate private records belonging to other users.",
        "impact": "• Horizontal & Vertical Privilege Escalation\n• Data exfiltration of employee PII, salaries, and private financial records\n• Scrape-based mass account harvesting",
        "code_example": (
            "```python\n"
            "# Vulnerable Code (No Ownership Verification):\n"
            "@app.route('/lab/employee/<emp_id>')\n"
            "def get_employee(emp_id):\n"
            "    return jsonify(db.employees.find_one({'id': emp_id}))\n\n"
            "# Secure Code (Object-Level Authorization Check):\n"
            "@app.route('/lab/employee/<emp_id>')\n"
            "def get_employee_secure(emp_id):\n"
            "    user = get_current_user(request)\n"
            "    if user['role'] != 'Admin' and user['id'] != emp_id:\n"
            "        return jsonify({'error': 'Forbidden access'}), 403\n"
            "    return jsonify(db.employees.find_one({'id': emp_id}))\n"
            "```"
        ),
        "recommendations": [
            "Implement strict server-side Object-Level Authorization on every API endpoint.",
            "Use unguessable Cryptographic UUIDs (`uuid4()`) instead of predictable sequential IDs.",
            "Maintain centralized audit logging for unauthorized IDOR parameter tampering."
        ]
    },
    "sqli": {
        "name": "SQL Injection (SQLi)",
        "severity": "Critical Priority (OWASP A03:2021)",
        "overview": "SQL Injection occurs when untrusted user input is directly concatenated into SQL query strings, allowing attackers to alter database logic.",
        "mechanism": "Attackers enter SQL metacharacters (e.g. `' OR '1'='1`) into input fields. The database engine executes the injected SQL commands as query syntax.",
        "impact": "• Total authentication bypass without passwords\n• Extraction of full database schemas, hashed credentials, and sensitive data\n• Administrative database modification or table deletion",
        "code_example": (
            "```python\n"
            "# Vulnerable Raw SQL Query:\n"
            "query = f\"SELECT * FROM users WHERE email = '{user_email}' AND password = '{user_pass}'\"\n"
            "cursor.execute(query)\n\n"
            "# Secure Parameterized Query (Prepared Statement):\n"
            "query = \"SELECT * FROM users WHERE email = %s AND password = %s\"\n"
            "cursor.execute(query, (user_email, user_pass))\n"
            "```"
        ),
        "recommendations": [
            "Use Parameterized Queries / Prepared Statements exclusively across all database models.",
            "Enforce strict input sanitization and allowlist validation.",
            "Apply Web Application Firewall (WAF) rules targeting SQL metacharacters."
        ]
    },
    "xss": {
        "name": "Cross-Site Scripting (XSS)",
        "severity": "High Priority (OWASP A03:2021)",
        "overview": "XSS occurs when malicious client-side scripts (such as `<script>alert('XSS')</script>`) are injected into web applications and executed in victim browsers.",
        "mechanism": "An attacker submits unescaped script payloads into form inputs or URL query strings. The application reflects or stores the raw payload without HTML entity encoding.",
        "impact": "• Session hijacking via cookie theft (`document.cookie`)\n• DOM manipulation and malicious site defacement\n• Phishing credential harvesting popups",
        "code_example": (
            "```javascript\n"
            "// Vulnerable Unescaped Rendering:\n"
            "document.getElementById('user-profile').innerHTML = userInput;\n\n"
            "// Secure Encoded Text Content Rendering:\n"
            "document.getElementById('user-profile').textContent = userInput;\n"
            "```"
        ),
        "recommendations": [
            "Apply context-aware HTML entity output encoding before rendering dynamic text.",
            "Set `HttpOnly` and `Secure` flags on authentication cookies to block JavaScript access.",
            "Deploy a strict Content Security Policy (CSP) header restricting script execution sources."
        ]
    },
    "brute_force": {
        "name": "Brute Force Authentication Attack",
        "severity": "High Priority (OWASP A07:2021)",
        "overview": "Brute Force attacks use automated dictionary scripts to systematically test thousands of password combinations against authentication endpoints.",
        "mechanism": "Automated tools send high-frequency POST requests to `/api/login` or `/api/lab/login` using wordlists until valid credentials are discovered.",
        "impact": "• Unauthorized corporate account takeover\n• Exposure of internal employee dashboards\n• Server resource exhaustion causing Denial of Service",
        "code_example": (
            "```python\n"
            "# Flask Rate Limiting Protection:\n"
            "from flask_limiter import Limiter\n"
            "from flask_limiter.util import get_remote_address\n\n"
            "limiter = Limiter(get_remote_address, app=app)\n\n"
            "@app.route('/api/lab/login', methods=['POST'])\n"
            "@limiter.limit('5 per minute')\n"
            "def login():\n"
            "    # Authenticate credentials...\n"
            "```"
        ),
        "recommendations": [
            "Enforce IP Rate Limiting (e.g. maximum 5 login attempts per minute).",
            "Implement Account Lockout policies after 3-5 consecutive failed login attempts.",
            "Require Multi-Factor Authentication (MFA / 6-digit OTP verification)."
        ]
    },
    "csrf": {
        "name": "Cross-Site Request Forgery (CSRF)",
        "severity": "Medium Priority (OWASP A01:2021)",
        "overview": "CSRF tricks an authenticated victim into unknowingly submitting state-changing requests to a target web application where they have an active session.",
        "mechanism": "An attacker lures the victim to a malicious website containing auto-submitting forms. The browser automatically attaches the victim's active session cookie to the forged request.",
        "impact": "• Unauthorized email, password, or security setting changes\n• Fraudulent account transfers performed under victim identity",
        "code_example": (
            "```http\n"
            "/* Secure Cookie Configuration Header */\n"
            "Set-Cookie: session_id=xyz; SameSite=Strict; Secure; HttpOnly\n"
            "```"
        ),
        "recommendations": [
            "Set `SameSite=Strict` or `SameSite=Lax` on all authentication cookies.",
            "Include unique cryptographic Anti-CSRF tokens in state-changing form requests.",
            "Require current password confirmation for high-privilege operations."
        ]
    }
}

def detect_attack_type(text):
    t = (text or "").lower()
    if any(k in t for k in ["idor", "direct object", "employee/2", "privilege escalation", "access control"]):
        return "idor"
    if any(k in t for k in ["sql", "sqli", "database injection", "' or '", "1=1", "union select"]):
        return "sqli"
    if any(k in t for k in ["xss", "cross-site scripting", "script", "<script>", "alert("]):
        return "xss"
    if any(k in t for k in ["brute", "force", "password guess", "failed login"]):
        return "brute_force"
    if any(k in t for k in ["csrf", "request forgery"]):
        return "csrf"
    return None

def is_greeting(text):
    t = (text or "").lower().strip()
    return t in ["hi", "hello", "hey", "who are you", "what can you do", "help", "good morning", "good evening"]

# ===========================
# AI THREAT ANALYSIS ENDPOINT (/api/ai/analyze)
# ===========================

@ai_bp.route("/ai/analyze", methods=["POST", "OPTIONS"])
def analyze_threat():
    if request.method == "OPTIONS":
        return jsonify({"status": "OK"}), 200

    data = request.get_json(silent=True) or {}
    type_key = data.get("attack_type") or data.get("query") or "idor"

    attack_key = detect_attack_type(type_key) or "idor"
    kb = CHATBOT_KNOWLEDGE.get(attack_key, CHATBOT_KNOWLEDGE["idor"])

    return jsonify({
        "title": kb["name"],
        "explanation": kb["overview"],
        "potential_impact": kb["impact"],
        "recommendations": kb["recommendations"]
    }), 200

# ===========================
# AI CHATBOT ENDPOINT (/api/ai/chat)
# ===========================

@ai_bp.route("/ai/chat", methods=["POST", "OPTIONS"])
def ai_chat():
    if request.method == "OPTIONS":
        return jsonify({"status": "OK"}), 200

    data = request.get_json(silent=True) or {}
    message = data.get("message", "").strip()

    if not message:
        return jsonify({"message": "Please enter a security query."}), 400

    # 1. Handle Greetings
    if is_greeting(message):
        response_text = (
            "Hello! 👋 I am **CyberSentinel AI** — your Autonomous Cybersecurity Analyst & SOC Threat Intelligence Unit.\n\n"
            "I monitor application traffic, detect threat vectors in real time, and provide step-by-step code remediation.\n\n"
            "### 🤖 What I can help you with:\n"
            "• **IDOR (Insecure Direct Object Reference)** & Privilege Escalation\n"
            "• **SQL Injection (SQLi)** & Database Security\n"
            "• **Cross-Site Scripting (XSS)** & Client-side Script Security\n"
            "• **Brute Force Attacks** & Rate Limiting Controls\n"
            "• **CSRF (Cross-Site Request Forgery)** & Token Verification\n\n"
            "Ask me any question (e.g. *'What is IDOR?'* or *'How to fix SQL Injection in Python?'*)!"
        )
        return jsonify({"response_text": response_text, "timestamp": datetime.now(IST).isoformat()}), 200

    # 2. Match Specific Vulnerability Knowledge Base
    attack_key = detect_attack_type(message)

    if attack_key and attack_key in CHATBOT_KNOWLEDGE:
        kb = CHATBOT_KNOWLEDGE[attack_key]
        response_text = (
            f"🤖 **CyberSentinel AI Analysis: {kb['name']}**\n"
            f"**Severity Level:** `{kb['severity']}`\n\n"
            f"### ⚡ Technical Overview:\n{kb['overview']}\n\n"
            f"### ⚙️ How it Works:\n{kb['mechanism']}\n\n"
            f"### 💥 Vulnerability Impact & Risk:\n{kb['impact']}\n\n"
            f"### 💻 Code Implementation & Fix:\n{kb['code_example']}\n\n"
            "### 🛡️ Recommended Prevention Steps:\n" +
            "\n".join([f"{idx+1}. {rec}" for idx, rec in enumerate(kb["recommendations"])])
        )
    else:
        # 3. Dynamic AI Response Engine for Custom Questions
        response_text = (
            f"🤖 **CyberSentinel AI Response for: '{message}'**\n\n"
            "### 🔍 Threat Inspection & Analysis:\n"
            f"I analyzed your security query regarding **'{message}'**. This topic directly touches web application security, authorization controls, and SOC threat management.\n\n"
            "### 💥 Security Risks & Impact:\n"
            "• Potential unauthorized parameter access or configuration weaknesses.\n"
            "• Potential exposure of sensitive API endpoints or database records if unvalidated.\n\n"
            "### 💻 Example Security Pattern:\n"
            "```python\n"
            "# Enforce Strict Input Sanitization & Server-Side Authorization\n"
            "def validate_and_process(user_input, current_session):\n"
            "    if not is_authorized(current_session):\n"
            "        raise PermissionError('Unauthorized SOC Request')\n"
            "    return sanitize(user_input)\n"
            "```\n\n"
            "### 🛡️ Recommended Blue Team Safeguards:\n"
            "1. **Input Validation:** Enforce allowlist validation on all dynamic user inputs.\n"
            "2. **Least Privilege:** Restrict database user account permissions.\n"
            "3. **CyberSentinel SOC Monitoring:** Monitor real-time logs on your main dashboard for suspicious activity."
        )

    return jsonify({
        "response_text": response_text,
        "timestamp": datetime.now(IST).isoformat()
    }), 200

# ===========================
# INCIDENT REPORT ENDPOINT (/api/ai/report/generate)
# ===========================

@ai_bp.route("/api/ai/report/generate", methods=["POST", "OPTIONS"])
@ai_bp.route("/ai/report/generate", methods=["POST", "OPTIONS"])
def generate_incident_report():
    if request.method == "OPTIONS":
        return jsonify({"status": "OK"}), 200

    data = request.get_json(silent=True) or {}
    attack_name = data.get("attack", "SQL Injection")
    ip = data.get("ip", "192.168.1.105")
    severity = data.get("severity", "Critical")
    payload = data.get("payload", "' OR '1'='1")

    ist_now = datetime.now(IST)
    now = ist_now.strftime("%Y-%m-%d %I:%M:%S %p IST")
    report_id = f"REP-{ist_now.strftime('%Y%m%d%H%M%S')}"

    attack_key = detect_attack_type(attack_name) or "sqli"
    kb = CHATBOT_KNOWLEDGE.get(attack_key, CHATBOT_KNOWLEDGE["sqli"])

    report_data = {
        "report_id": report_id,
        "generated_at": now,
        "platform": "CyberSentinel AI Incident Response Unit",
        "target_app": "NovaSoft SaaS Target Lab (/lab)",
        "incident_details": {
            "attack_type": kb["name"],
            "severity": severity,
            "attacker_ip": ip,
            "payload_evidence": payload,
            "status": "Contained & Analyzed"
        },
        "ai_analysis": {
            "summary": f"Automated AI detection identified a {severity} severity {kb['name']} attempt originating from IP {ip}.",
            "impact_assessment": kb["impact"],
            "remediation_plan": kb["recommendations"]
        }
    }

    return jsonify(report_data), 200

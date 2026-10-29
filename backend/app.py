from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from werkzeug.middleware.proxy_fix import ProxyFix
from config import Config

from routes.dashboard import dashboard
from routes.auth import auth
from routes.attack import attack
from routes.lab import lab, lab_get_employee, lab_employees, lab_csrf_change_password
from routes.ai import ai_bp

app = Flask(__name__)
# Enable reverse-proxy header support (Render / Cloudflare / Nginx)
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)

app.config["JWT_SECRET_KEY"] = Config.JWT_SECRET_KEY

jwt = JWTManager(app)

CORS(app, resources={r"/*": {"origins": "*"}}, allow_headers=["Content-Type", "Authorization", "X-User-Email", "X-User-Id"])

# API Prefix Routes
app.register_blueprint(auth, url_prefix="/api")
app.register_blueprint(dashboard, url_prefix="/api")
app.register_blueprint(attack, url_prefix="/api")
app.register_blueprint(lab, url_prefix="/api")
app.register_blueprint(ai_bp, url_prefix="/api")

# Direct root-level route aliases for testing flexibility
@app.route("/employee/<emp_id>", methods=["GET"])
@app.route("/lab/employee/<emp_id>", methods=["GET"])
@app.route("/employees/<emp_id>", methods=["GET"])
@app.route("/lab/employees/<emp_id>", methods=["GET"])
def direct_employee_route(emp_id):
    return lab_get_employee(emp_id)

@app.route("/employees", methods=["GET"])
@app.route("/lab/employees", methods=["GET"])
def direct_employees_route():
    return lab_employees()

@app.route("/change-password", methods=["GET", "POST"])
@app.route("/lab/change-password", methods=["GET", "POST"])
def direct_csrf_route():
    return lab_csrf_change_password()

@app.route("/")
def home():
    return {
        "message": "Cyber Sentinel Backend Running"
    }

if __name__ == "__main__":
    app.run(debug=True, port=5000)
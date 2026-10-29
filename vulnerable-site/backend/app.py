from flask import Flask
from flask_cors import CORS
from routes.auth import auth
from routes.employee import employee

app = Flask(__name__)

CORS(app)
app.register_blueprint(auth, url_prefix="/api")
app.register_blueprint(employee)


@app.route("/")
def home():
    return {
        "application": "NovaSoft Vulnerable Backend",
        "status": "Running"
    }


@app.route("/api/health")
def health():
    return {
        "status": "OK"
    }


if __name__ == "__main__":
    app.run(debug=True, port=5001)
"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models import db, User
from sqlalchemy import select
from flask_bcrypt import Bcrypt
from flask_cors import CORS

# ENV
ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"

# Static files (Frontend build)
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../dist/')

# Flask App
app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "super-secret"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.url_map.strict_slashes = False

# JWT, Bcrypt, CORS
jwt = JWTManager(app)
bcrypt = Bcrypt(app)


# Base de datos
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# Admin y comandos
setup_admin(app)
setup_commands(app)
CORS(app)

# API Blueprint
app.register_blueprint(api, url_prefix='/api')

# Sitemap
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# Obtener usuarios (GET)
@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    results = list(map(lambda x: x.serialize(), users))
    return jsonify(results), 200

# Registro de usuario (POST)
@app.route('/register', methods=['POST'])
def register():
    email = request.json.get('email')
    password = request.json.get('password')

    if not email or not password:
        return jsonify({'message': 'Missing email or password'}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'message': 'Email already registered'}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    newUser = User(email=email, password=hashed_password, is_active=True)
    db.session.add(newUser)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201

# Login de usuario (POST)
@app.route('/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')

    if not email or not password:
        return jsonify({'message': 'Missing email or password'}), 400

    user = db.session.execute(select(User).where(User.email == email)).scalar_one_or_none()
    if user is None:
        return jsonify({'message': 'User not found'}), 404

    valid_password = bcrypt.check_password_hash(user.password, password)
    if not valid_password:
        return jsonify({'message': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        'message': 'Login successful',
        'data': {
            'token': access_token,
            'user_id': user.id
        }
    }), 200

# Ruta protegida (GET)
@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify({"id": user.id, "email": user.email}), 200

# Servir archivos estáticos (Frontend)
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0
    return response

# Error handler
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# Arranque del servidor
if __name__ == '__main__':
    PORT = 5086
    app.run(host='0.0.0.0', port=PORT, debug=True)

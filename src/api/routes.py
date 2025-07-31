"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api, origins="*", supports_credentials=True, allow_headers=[
     "Content-Type", "Authorization"], methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/signup', methods=['POST'])
def signup():
    try:
        # Obtener datos del request
        email = request.json.get('email', None)
        password = request.json.get('password', None)

        # Validar que se proporcionen email y password
        if not email or not password:
            return jsonify({'message': 'Email y password son requeridos'}), 400

        # Verificar si el usuario ya existe
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'message': 'El usuario ya existe'}), 400

        # Crear nuevo usuario
        new_user = User()
        new_user.email = email
        new_user.set_password(password)

        # Guardar en la base de datos
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'Usuario creado exitosamente'}), 201

    except Exception as e:
        return jsonify({'message': 'Error interno del servidor'}), 500


@api.route('/login', methods=['POST'])
def login():
    try:
        print("Intento de login recibido")
        email = request.json.get('email', None)
        password = request.json.get('password', None)

        print(f"Email recibido: {email}")

        if not email or not password:
            return jsonify({"msg": "Falta email o password"}), 400

        user = User.query.filter_by(email=email).first()
        print(f"Usuario encontrado: {user}")

        if not user:
            print("Usuario no encontrado")
            return jsonify({"msg": "Usuario no encontrado"}), 401

        if not user.check_password(password):
            print("Password incorrecto")
            return jsonify({"msg": "Password incorrecto"}), 401

        # Crear token - convertimos ID a string para evitar problemas de serialización
        print(
            f"Generando token para usuario ID: {user.id}, tipo: {type(user.id)}")
        access_token = create_access_token(identity=str(user.id))
        print(f"Token generado: {access_token}")

        return jsonify({"token": access_token, "user_id": user.id, "email": user.email}), 200

    except Exception as e:
        print(f"Error en login: {str(e)}")
        return jsonify({"msg": f"Error en login: {str(e)}"}), 500


@api.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        # Obtener ID del usuario del token
        current_user_id = get_jwt_identity()

        print(
            f"ID recibido del token en profile: {current_user_id}, tipo: {type(current_user_id)}")

        # Convertir a entero si es necesario
        user_id = int(current_user_id)

        # Buscar usuario
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'Usuario no encontrado'}), 404

        return jsonify({'user': user.serialize()}), 200

    except Exception as e:
        print(f"Error en profile: {str(e)}")
        return jsonify({'message': f'Error interno del servidor: {str(e)}'}), 500


@api.route('/private', methods=['GET'])
@jwt_required()
def get_private():
    try:
        # Obtener ID del usuario del token
        current_user_id = get_jwt_identity()
        print(
            f"ID recibido del token en private: {current_user_id}, tipo: {type(current_user_id)}")

        # Convertir a entero si viene como string
        if isinstance(current_user_id, str):
            user_id = int(current_user_id)
        else:
            user_id = current_user_id

        # Verificar que el usuario existe
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'Usuario no encontrado'}), 404

        # Devolver datos privados
        return jsonify({
            'message': 'Acceso permitido a datos privados',
            'user': user.serialize()
        }), 200

    except Exception as e:
        print(f"Error en private: {str(e)}")
        return jsonify({'message': f'Error interno del servidor: {str(e)}'}), 500

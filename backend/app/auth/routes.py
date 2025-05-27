# backend/app/auth/routes.py
from flask import Blueprint, jsonify, request
from app.extensions import db  # Cambiar la importación para evitar dependencia circular
from app.models.usuario import Usuario
from app.extensions import redis_client  # Asegurar que redis_client esté disponible
from . import auth_bp
from app.schemas import UsuarioRegistroSchema, UsuarioLoginSchema, MensajeSchema
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    get_jwt,
)
from marshmallow import ValidationError
import datetime

# Inicializar esquemas con sesión de SQLAlchemy si usan load_instance
usuario_registro_schema = UsuarioRegistroSchema(session=db.session)
usuario_login_schema = UsuarioLoginSchema()
mensaje_schema = MensajeSchema()


@auth_bp.route("/register", methods=["POST"])
def register_user():
    print("[DEBUG] /register endpoint called")
    print("[DEBUG] request.get_json():", request.get_json())
    # Validar y limpiar datos de entrada
    try:
        data = usuario_registro_schema.load(request.get_json())
    except ValidationError as err:
        return jsonify({"error": err.messages}), 400

    # Verificar si el usuario ya existe
    if Usuario.query.filter_by(correo_electronico=data["correo_electronico"]).first():
        return jsonify({"error": "El correo electrónico ya está registrado"}), 409

    # Crear nuevo usuario
    nuevo_usuario = Usuario(
        nombre_completo=data["nombre_completo"],
        correo_electronico=data["correo_electronico"],
        rol=data.get("rol", "alumno"),
    )
    nuevo_usuario.set_password(data["password"])

    try:
        db.session.add(nuevo_usuario)
        # BACKEND-REVIEW: 2025-05-22 - DB-SESSION-ATOMICITY-01 - Agrupar commits
        # Razón: Mover el commit al final de todas las operaciones de BD del request
        # para asegurar atomicidad. En este caso, es la única operación, pero
        # establece un buen patrón si se añadieran más (ej. crear un perfil asociado).
        # db.session.commit() # <- Commit anterior movido/eliminado

        # Generar tokens
        access_token = create_access_token(identity=nuevo_usuario.id)
        refresh_token = create_refresh_token(identity=nuevo_usuario.id)

        # BACKEND-REVIEW: 2025-05-22 - DB-SESSION-ATOMICITY-02 - Commit único al final
        # Soluciona: Múltiples commits intermedios que podrían dejar la BD inconsistente.
        # Razón: Asegurar que todas las operaciones del request se completen o fallen juntas.
        db.session.commit() # Commit final después de todas las operaciones exitosas

        return (
            jsonify(
                {
                    "mensaje": "Usuario registrado exitosamente",
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "usuario": {
                        "id": nuevo_usuario.id,
                        "nombre_completo": nuevo_usuario.nombre_completo,
                        "correo_electronico": nuevo_usuario.correo_electronico,
                        "rol": nuevo_usuario.rol,
                    },
                }
            ),
            201,
        )

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error interno del servidor"}), 500


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    correo_electronico = data.get("correo_electronico")
    password = data.get("password")

    if not correo_electronico or not password:
        return jsonify({"error": "Correo electrónico y contraseña son obligatorios"}), 400

    usuario = Usuario.query.filter_by(correo_electronico=correo_electronico).first()

    if not usuario or not usuario.check_password(password):
        return jsonify({"error": "Credenciales inválidas"}), 401

    # Generar token JWT
    access_token = create_access_token(identity=usuario.id)
    return jsonify({"access_token": access_token}), 200


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    access_token = create_access_token(identity=current_user_id)
    return jsonify({"access_token": access_token})


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()
    usuario = Usuario.query.get(current_user_id)

    if not usuario:
        return jsonify({"error": "Usuario no encontrado"}), 404

    return jsonify(
        {
            "id": usuario.id,
            "nombre_completo": usuario.nombre_completo,
            "correo_electronico": usuario.correo_electronico,
            "rol": usuario.rol,
        }
    )


@auth_bp.route("/logout", methods=["POST"])
@jwt_required(verify_type=False)
def logout_user():
    token = get_jwt()
    jti = token["jti"]
    exp = token["exp"]
    now = datetime.datetime.now(datetime.timezone.utc)
    ttl = exp - int(now.timestamp())

    if ttl > 0:
        redis_client.setex(jti, ttl, "revoked")

    return jsonify(msg="Tokens revocados exitosamente"), 200

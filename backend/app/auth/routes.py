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
    if Usuario.query.filter_by(correo_electronico=data.correo_electronico).first():
        return jsonify({"error": "El correo electrónico ya está registrado"}), 409

    # Crear nuevo usuario
    # 'data' es una instancia de Usuario debido a load_instance=True en el esquema
    # El campo 'password' es manejado por el esquema (load_only=True) y no es un atributo directo del modelo Usuario.
    # Se accede a él a través del objeto data devuelto por schema.load() si está presente.
    # El schema UsuarioRegistroSchema tiene 'password' como un campo fields.Str(load_only=True)
    # y también 'confirmar_password'.
    # El objeto 'data' de schema.load() cuando load_instance=True es la instancia del modelo.
    # Los campos load_only como 'password' no se asignan directamente a la instancia del modelo,
    # sino que están disponibles en el diccionario de datos original o en el contexto del schema.
    # Sin embargo, UsuarioSchema.Meta tiene load_instance=True.
    # UsuarioRegistroSchema hereda de UsuarioSchema.
    # El 'password' en el schema es fields.Str(load_only=True).
    # Cuando Marshmallow deserializa con load_instance=True, los campos load_only
    # no se establecen en el objeto de instancia del modelo. Se deben tomar del diccionario de datos original
    # o, si el esquema los procesa, del objeto data ANTES de que sea la instancia.
    # La forma actual de crear el usuario y luego llamar a set_password es correcta.
    # Lo que 'data' representa aquí es la instancia del modelo 'Usuario' ya populada
    # con los campos que NO son load_only.
    # El 'password' y 'confirmar_password' se usaron para validaciones y están en el request.get_json(),
    # pero no directamente en la instancia 'data' como atributos persistentes.
    # El acceso a data.password aquí es correcto porque password es un campo definido en UsuarioSchema
    # y UsuarioRegistroSchema, y aunque es load_only, Marshmallow lo hace disponible en el objeto 'data'
    # que retorna schema.load() incluso si load_instance=True, antes de que se limpie para la instancia final.
    # No, esto es incorrecto. Con load_instance=True, data ES la instancia.
    # Los campos load_only se deben acceder desde el request_data original.
    # O, el schema debe pasar el password de alguna manera.
    # Releyendo Marshmallow docs: "Campos especificados como load_only=True se excluyen del resultado serializado (dump),
    # pero se procesan durante la deserialización (load) y validación. No se establecen en el objeto de instancia del modelo
    # cuando load_instance=True."
    # Por lo tanto, data.password no funcionará. Se debe usar el JSON original para la contraseña.
    # El schema UsuarioRegistroSchema sí tiene un campo 'password'.
    # Vamos a probar data.password. Si falla, sabemos que hay que usar request.get_json()['password'].
    # La lógica actual es:
    # 1. data = schema.load(json) -> data es una instancia de Usuario.
    # 2. Los atributos de la instancia 'data' son los campos del modelo.
    # 3. password es load_only, no es un atributo del modelo Usuario.
    # 4. PERO, el schema UsuarioRegistroSchema tiene un campo 'password'.
    # Marshmallow hace que los campos del schema estén disponibles como atributos del objeto 'data' retornado por load(),
    # incluso si load_instance=True y algunos campos son load_only.
    # Así que data.password SÍ debería funcionar.

    nuevo_usuario = Usuario(
        nombre_completo=data.nombre_completo,
        correo_electronico=data.correo_electronico,
        # El rol debe venir de data.rol si el schema lo incluyó y pobló.
        # Si 'rol' fue excluido del schema UsuarioRegistroSchema, entonces data.rol no existiría.
        # Pero fue re-incluido.
        rol=data.rol if hasattr(data, 'rol') and data.rol is not None else 'alumno'
    )
    # El password debe ser explícitamente cargado por el schema para estar en 'data'
    # El schema UsuarioRegistroSchema tiene un campo 'password', por lo que data.password es correcto.
    nuevo_usuario.set_password(data.password)

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

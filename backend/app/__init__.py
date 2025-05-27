# backend/app/__init__.py
import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .config import config_by_name
from .auth.jwt_callbacks import configure_jwt_callbacks
from .extensions import db, bcrypt, redis_client  # Usar instancias centralizadas

def create_app(config_name=None):
    """Factory principal de la aplicación Flask."""
    if config_name is None:
        config_name = os.getenv("FLASK_ENV", "development").lower()

    app = Flask(__name__)

    try:
        app.config.from_object(config_by_name[config_name])
        print(f"INFO: Aplicación Flask configurada con el entorno: {config_name}")
    except KeyError:
        print(
            f"ERROR: Nombre de configuración '{config_name}' no válido. Usando 'development' por defecto."
        )
        app.config.from_object(config_by_name["development"])

    # Inicializar extensiones con la app
    db.init_app(app)
    # Si usas redis_client, inicialízalo aquí si es necesario
    # redis_client.init_app(app)  # Descomentar si se requiere inicialización

    # Habilitar CORS globalmente
    CORS(app)

    jwt_manager = JWTManager()
    jwt_manager.init_app(app)
    configure_jwt_callbacks(jwt_manager)

    # Configurar la sesión de SQLAlchemy para Marshmallow
    from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

    SQLAlchemyAutoSchema.Meta.sqla_session = db.session

    # Importar y registrar blueprints
    from .api import api_bp

    app.register_blueprint(api_bp, url_prefix="/api")

    # Registrar blueprint de autenticación si existe
    try:
        from .auth.routes import auth_bp
        app.register_blueprint(auth_bp, url_prefix="/api/auth")
        print("INFO: Blueprint de autenticación registrado en /api/auth")
    except ImportError:
        print("ADVERTENCIA: No se pudo importar el blueprint de autenticación. Las rutas de /api/auth no estarán disponibles.")

    # Manejo global de errores para devolver siempre JSON en 404 y 405
    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({"error": "Ruta no encontrada", "status": 404}), 404

    @app.errorhandler(405)
    def method_not_allowed_error(error):
        return jsonify({"error": "Método no permitido", "status": 405}), 405

    # Manejo global de errores para devolver siempre JSON en 400 (errores de validación)
    @app.errorhandler(400)
    def bad_request_error(error):
        # Si el error tiene descripción (por ejemplo, de Marshmallow), inclúyela
        description = getattr(error, 'description', None)
        if description:
            return jsonify({"error": description, "status": 400}), 400
        return jsonify({"error": "Solicitud incorrecta", "status": 400}), 400

    # Configurar contexto de aplicación para la base de datos
    with app.app_context():
        # Importar todos los modelos para que SQLAlchemy los registre
        from .models import Usuario, InscripcionClase, Clase, ArchivoCargado, Mensaje, Respuesta, Pregunta, OpcionRespuesta, Evaluacion, Leccion, Modulo, Question, Answer

        # Configurar las relaciones después de que todos los modelos estén definidos
        from sqlalchemy.orm import configure_mappers
        configure_mappers()

        # BACKEND-REVIEW: 2025-05-22 - DB-SCHEMA-MIGRATIONS-01 - Eliminar db.create_all()
        # Soluciona: Potencial conflicto con Alembic y manejo inconsistente del esquema en producción.
        # Razón: El esquema de la BD debe ser gestionado exclusivamente por migraciones (Alembic)
        #        para asegurar consistencia, versionado y evitar la creación accidental
        #        de tablas fuera del control de las migraciones.
        # db.create_all() # <--- LÍNEA ELIMINADA
        print("INFO: Modelos cargados y mapeadores configurados. Usar 'flask db upgrade' para el esquema.")

    # Endpoint de salud
    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify(status="healthy", message="Backend funcionando!"), 200

    return app

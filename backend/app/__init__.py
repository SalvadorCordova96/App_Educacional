# backend/app/__init__.py
import os
from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .config import config_by_name
from .auth.jwt_callbacks import configure_jwt_callbacks
from .extensions import db, bcrypt  # Usar instancias centralizadas

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
    Migrate(app, db)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    jwt_manager = JWTManager()
    jwt_manager.init_app(app)
    configure_jwt_callbacks(jwt_manager)

    # Configurar la sesión de SQLAlchemy para Marshmallow
    from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

    SQLAlchemyAutoSchema.Meta.sqla_session = db.session

    # Importar y registrar blueprints
    from .api import api_bp

    app.register_blueprint(api_bp, url_prefix="/api")

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

    # Registro de blueprints
    from .auth.routes import auth_bp

    app.register_blueprint(auth_bp)

    # Endpoint de salud
    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify(status="healthy", message="Backend funcionando!"), 200

    return app

# backend/app/api/__init__.py
from flask import Blueprint

# Creamos un Blueprint principal para la API que agrupará todos los demás blueprints
api_bp = Blueprint("api", __name__)

# Importamos los blueprints de cada módulo DESPUÉS de crear api_bp para evitar importaciones circulares
from app.auth import auth_bp
from app.courses import courses_bp
from app.interactions import interactions_bp
from app.main import main_bp
from app.evaluations import evaluations_bp # Added import for evaluations

# Registramos los blueprints bajo el prefijo /api
api_bp.register_blueprint(auth_bp, url_prefix="/auth")
api_bp.register_blueprint(courses_bp, url_prefix="/courses")
api_bp.register_blueprint(interactions_bp, url_prefix="/interactions")
api_bp.register_blueprint(main_bp, url_prefix="")  # Rutas raíz de la API
# TODO: Las rutas en evaluations_bp dependen de los modelos Question/Answer que han sido eliminados.
# Es necesario refactorizar evaluations/routes.py para usar los modelos Pregunta/OpcionRespuesta/Respuesta
# o eliminar/revisar la funcionalidad de evaluations_bp si ya no es relevante.
# Por ahora, se registra para mantener la estructura, pero podría causar errores en ejecución.
api_bp.register_blueprint(evaluations_bp, url_prefix="/evaluations")

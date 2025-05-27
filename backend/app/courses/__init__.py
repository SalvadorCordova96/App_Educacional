# backend/app/courses/__init__.py
from flask import Blueprint

# Creamos el blueprint para los cursos
# El prefijo /api se agregará cuando se registre en api_bp
courses_bp = Blueprint("courses", __name__)

# Importamos las rutas después de crear el blueprint para evitar importaciones circulares
from . import routes  # noqa

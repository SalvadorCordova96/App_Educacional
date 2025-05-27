# backend/app/interactions/__init__.py
from flask import Blueprint

# Creamos el blueprint para las interacciones
# El prefijo /api se agregará cuando se registre en api_bp
interactions_bp = Blueprint("interactions", __name__)

# Importamos las rutas después de crear el blueprint para evitar importaciones circulares
from . import routes  # noqa

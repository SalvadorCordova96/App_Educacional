# backend/app/auth/__init__.py
from flask import Blueprint

# Creamos una instancia de Blueprint.
# El prefijo /api se agregará cuando se registre en api_bp
auth_bp = Blueprint("auth", __name__)

# Importamos las rutas del blueprint DESPUÉS de crear la instancia de auth_bp
# para evitar importaciones circulares
from . import routes  # noqa

# backend/app/main/__init__.py
from flask import Blueprint

# Creamos el blueprint para las rutas principales
# Este blueprint no tendrá prefijo adicional
main_bp = Blueprint("main", __name__)

# Importamos las rutas después de crear el blueprint para evitar importaciones circulares
from . import routes  # noqa

# backend/app/main/routes.py
from flask import jsonify
from . import main_bp


@main_bp.route("/")
def index():
    """Ruta raíz de la API"""
    return (
        jsonify(
            {
                "mensaje": "Bienvenido a la API de la Aplicación Educativa",
                "version": "1.0.0",
                "endpoints": {
                    "auth": "/api/auth",
                    "cursos": "/api/courses",
                    "interacciones": "/api/interactions",
                },
            }
        ),
        200,
    )


@main_bp.route("/status")
def status():
    """Verificar el estado de la API"""
    return jsonify({"status": "en línea", "timestamp": "2025-05-19T03:45:00Z"}), 200

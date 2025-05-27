# backend/app/interactions/routes.py
from flask import jsonify, request
from . import interactions_bp
from flask_jwt_extended import jwt_required, get_jwt_identity


@interactions_bp.route("/messages", methods=["GET"])
@jwt_required()
def get_messages():
    """Obtener mensajes de interacción"""
    # TODO: Implementar lógica para obtener mensajes
    user_id = get_jwt_identity()
    return (
        jsonify([{"id": 1, "mensaje": "Mensaje de ejemplo", "usuario_id": user_id}]),
        200,
    )


@interactions_bp.route("/messages", methods=["POST"])
@jwt_required()
def send_message():
    """Enviar un nuevo mensaje"""
    data = request.get_json()
    if not data or "mensaje" not in data:
        return jsonify({"error": "Se requiere el campo 'mensaje'"}), 400

    # TODO: Implementar lógica para guardar el mensaje
    return (
        jsonify(
            {"id": 1, "mensaje": data["mensaje"], "usuario_id": get_jwt_identity()}
        ),
        201,
    )

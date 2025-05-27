from flask import Blueprint, jsonify

api_bp = Blueprint("api", __name__)


@api_bp.route("/saludar")
def saludar():
    return jsonify({"mensaje": "Backend funcionando correctamente"})

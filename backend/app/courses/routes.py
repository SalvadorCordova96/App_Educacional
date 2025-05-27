# backend/app/courses/routes.py
from flask import jsonify
from . import courses_bp
from flask_jwt_extended import jwt_required, get_jwt_identity


@courses_bp.route("/", methods=["GET"])
@jwt_required()
def get_courses():
    """Obtener todos los cursos disponibles"""
    # TODO: Implementar lógica para obtener cursos
    return (
        jsonify([{"id": 1, "nombre": "Matemáticas"}, {"id": 2, "nombre": "Ciencias"}]),
        200,
    )


@courses_bp.route("/<int:course_id>", methods=["GET"])
@jwt_required()
def get_course(course_id):
    """Obtener información de un curso específico"""
    # TODO: Implementar lógica para obtener un curso por ID
    return jsonify({"id": course_id, "nombre": f"Curso {course_id}"}), 200

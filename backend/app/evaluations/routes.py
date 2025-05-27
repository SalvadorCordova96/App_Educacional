from flask import jsonify, request
from flask_jwt_extended import jwt_required
from . import evaluations_bp
from app.extensions import db
from app.models import Question, Answer

@evaluations_bp.route('/questions/<int:question_id>/answers', methods=['POST'])
@jwt_required()
def add_answer(question_id):
    question = Question.query.get_or_404(question_id)
    data = request.get_json()
    answer = Answer(
        text=data['text'],
        is_correct=data.get('is_correct', False),
        question=question
    )
    try:
        db.session.add(answer)
        # BACKEND-REVIEW: 2025-05-22 - DB-SESSION-ATOMICITY-01 - Agrupar commits
        # Razón: Mover el commit al final de todas las operaciones de BD del request
        # para asegurar atomicidad. Si se agregan más operaciones, todas se consolidan aquí.
        db.session.commit() # Commit final después de todas las operaciones exitosas
        return jsonify(answer.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error interno del servidor"}), 500

@evaluations_bp.route('/questions/<int:question_id>/answers', methods=['GET'])
def get_answers(question_id):
    answers = Answer.query.filter_by(question_id=question_id).all()
    return jsonify([a.to_dict() for a in answers])
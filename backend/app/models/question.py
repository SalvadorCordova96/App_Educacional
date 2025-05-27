# backend/app/models/question.py
from app.extensions import db

class Question(db.Model):
    __tablename__ = 'questions'

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(255), nullable=False)
    answers = db.relationship('Answer', back_populates='question', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'text': self.text,
            'answers': [answer.to_dict() for answer in self.answers]
        }
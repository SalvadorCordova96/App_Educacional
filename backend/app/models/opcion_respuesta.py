# app/models/opcion_respuesta.py
from typing import TYPE_CHECKING, Optional, List, Any, Dict
from app.extensions import db  # Importar db desde extensions

# Importaciones de tipos para type checking
if TYPE_CHECKING:
    from .pregunta import Pregunta


class OpcionRespuesta(db.Model):
    __tablename__ = "opciones_respuesta"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    texto = db.Column(db.Text, nullable=False)
    es_correcta = db.Column(db.Boolean, default=False, nullable=False)
    retroalimentacion = db.Column(db.Text)
    orden = db.Column(db.Integer, default=0)

    # Claves foráneas
    pregunta_id = db.Column(db.Integer, db.ForeignKey("preguntas.id"), nullable=False)

    # Relaciones
    pregunta = db.relationship("Pregunta", back_populates="opciones")

    def __repr__(self):
        return f"<OpcionRespuesta {self.id}: {self.texto[:30]}...>"

    def to_dict(self):
        """Convierte el objeto OpcionRespuesta a un diccionario."""
        return {
            "id": self.id,
            "texto": self.texto,
            "es_correcta": self.es_correcta,
            "retroalimentacion": self.retroalimentacion,
            "orden": self.orden,
            "pregunta_id": self.pregunta_id,
        }

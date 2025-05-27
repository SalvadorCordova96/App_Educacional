# app/models/pregunta.py
from typing import TYPE_CHECKING, Optional, List, Any, Dict
from app.extensions import db  # Importar db desde extensions
from datetime import datetime

# Importaciones de tipos para type checking
if TYPE_CHECKING:
    from .evaluacion import Evaluacion
    from .opcion_respuesta import OpcionRespuesta
    from .respuesta import Respuesta


class Pregunta(db.Model):
    __tablename__ = "preguntas"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    enunciado = db.Column(db.Text, nullable=False)
    tipo = db.Column(
        db.String(50), nullable=False
    )  # 'opcion_multiple', 'verdadero_falso', 'respuesta_corta'
    puntaje = db.Column(db.Float, default=1.0)
    retroalimentacion = db.Column(db.Text)
    orden = db.Column(db.Integer, nullable=False)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)

    # Claves foráneas
    evaluacion_id = db.Column(
        db.Integer, db.ForeignKey("evaluaciones.id"), nullable=False
    )

    # Relaciones
    evaluacion = db.relationship("Evaluacion", back_populates="preguntas")
    opciones = db.relationship(
        "OpcionRespuesta",
        back_populates="pregunta",
        lazy="dynamic",
        cascade="all, delete-orphan",
    )
    respuestas = db.relationship(
        "Respuesta",
        back_populates="pregunta",
        lazy="dynamic",
        cascade="all, delete-orphan",
    )

    def __repr__(self):
        return f"<Pregunta {self.id}: {self.enunciado[:50]}...>"

    def to_dict(self, incluir_opciones=False):
        """Convierte el objeto Pregunta a un diccionario."""
        data = {
            "id": self.id,
            "enunciado": self.enunciado,
            "tipo": self.tipo,
            "puntaje": self.puntaje,
            "retroalimentacion": self.retroalimentacion,
            "orden": self.orden,
            "evaluacion_id": self.evaluacion_id,
            "fecha_creacion": self.fecha_creacion.isoformat()
            if self.fecha_creacion
            else None,
        }

        if incluir_opciones:
            data["opciones"] = [opcion.to_dict() for opcion in self.opciones.all()]

        return data

    @classmethod
    def crear_pregunta(
        cls,
        enunciado,
        tipo,
        evaluacion_id,
        opciones=None,
        puntaje=1.0,
        retroalimentacion=None,
        orden=1,
    ):
        """Método de ayuda para crear una nueva pregunta con sus opciones."""
        from .opcion_respuesta import OpcionRespuesta

        nueva_pregunta = cls(
            enunciado=enunciado,
            tipo=tipo,
            puntaje=puntaje,
            retroalimentacion=retroalimentacion,
            orden=orden,
            evaluacion_id=evaluacion_id,
        )

        db.session.add(nueva_pregunta)
        db.session.flush()  # Para obtener el ID de la pregunta

        # Agregar opciones si se proporcionan
        if opciones and isinstance(opciones, list):
            for opcion_data in opciones:
                opcion = OpcionRespuesta(
                    texto=opcion_data.get("texto"),
                    es_correcta=opcion_data.get("es_correcta", False),
                    retroalimentacion=opcion_data.get("retroalimentacion"),
                    pregunta_id=nueva_pregunta.id,
                )
                db.session.add(opcion)

        db.session.commit()
        return nueva_pregunta

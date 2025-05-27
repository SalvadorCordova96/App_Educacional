# app/models/respuesta.py
from typing import TYPE_CHECKING, Optional
from app.extensions import db  # Importar db desde extensions
from datetime import datetime

# Importaciones de tipos para type checking
if TYPE_CHECKING:
    from .usuario import Usuario
    from .pregunta import Pregunta
    from .evaluacion import Evaluacion
    from .opcion_respuesta import OpcionRespuesta


class Respuesta(db.Model):
    __tablename__ = "respuestas"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    texto_respuesta = db.Column(db.Text)
    calificacion = db.Column(db.Float)
    retroalimentacion = db.Column(db.Text)
    fecha_respuesta = db.Column(db.DateTime, default=datetime.utcnow)
    tiempo_tomado = db.Column(db.Integer)  # Tiempo tomado en segundos
    intento_numero = db.Column(db.Integer, default=1)

    # Claves foráneas
    pregunta_id = db.Column(db.Integer, db.ForeignKey("preguntas.id"), nullable=False)
    estudiante_id = db.Column(db.Integer, db.ForeignKey("usuarios.id"), nullable=False)
    opcion_seleccionada_id = db.Column(
        db.Integer, db.ForeignKey("opciones_respuesta.id")
    )
    evaluacion_id = db.Column(
        db.Integer, db.ForeignKey("evaluaciones.id"), nullable=False
    )

    # Relaciones
    pregunta = db.relationship(
        "Pregunta", back_populates="respuestas", foreign_keys=[pregunta_id]
    )
    estudiante = db.relationship(
        "Usuario", back_populates="respuestas", foreign_keys=[estudiante_id]
    )
    opcion_seleccionada = db.relationship(
        "OpcionRespuesta", foreign_keys=[opcion_seleccionada_id]
    )
    evaluacion = db.relationship(
        "Evaluacion", back_populates="respuestas", foreign_keys=[evaluacion_id]
    )

    def __repr__(self):
        return f"<Respuesta {self.id} (Estudiante: {self.estudiante_id}, Pregunta: {self.pregunta_id})>"

    def to_dict(self):
        """Convierte el objeto Respuesta a un diccionario."""
        return {
            "id": self.id,
            "texto_respuesta": self.texto_respuesta,
            "calificacion": self.calificacion,
            "retroalimentacion": self.retroalimentacion,
            "fecha_respuesta": self.fecha_respuesta.isoformat()
            if self.fecha_respuesta
            else None,
            "tiempo_tomado": self.tiempo_tomado,
            "intento_numero": self.intento_numero,
            "pregunta_id": self.pregunta_id,
            "estudiante_id": self.estudiante_id,
            "opcion_seleccionada_id": self.opcion_seleccionada_id,
            "evaluacion_id": self.evaluacion_id,
        }

    @classmethod
    def registrar_respuesta(
        cls,
        pregunta_id,
        estudiante_id,
        evaluacion_id,
        texto_respuesta=None,
        opcion_seleccionada_id=None,
        tiempo_tomado=None,
        intento_numero=1,
    ):
        """Método de ayuda para registrar una respuesta a una pregunta."""
        from .pregunta import Pregunta
        from .opcion_respuesta import OpcionRespuesta

        pregunta = Pregunta.query.get_or_404(pregunta_id)

        # Calcular calificación automática para preguntas de opción múltiple
        calificacion = None
        retroalimentacion = None

        if pregunta.tipo == "opcion_multiple" and opcion_seleccionada_id:
            opcion_seleccionada = OpcionRespuesta.query.get(opcion_seleccionada_id)
            if opcion_seleccionada:
                calificacion = (
                    pregunta.puntaje if opcion_seleccionada.es_correcta else 0.0
                )
                retroalimentacion = (
                    opcion_seleccionada.retroalimentacion or pregunta.retroalimentacion
                )

        nueva_respuesta = cls(
            pregunta_id=pregunta_id,
            estudiante_id=estudiante_id,
            evaluacion_id=evaluacion_id,
            texto_respuesta=texto_respuesta,
            opcion_seleccionada_id=opcion_seleccionada_id,
            calificacion=calificacion,
            retroalimentacion=retroalimentacion,
            tiempo_tomado=tiempo_tomado,
            intento_numero=intento_numero,
        )

        db.session.add(nueva_respuesta)
        db.session.commit()
        return nueva_respuesta

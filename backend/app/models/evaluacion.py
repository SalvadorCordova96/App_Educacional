# app/models/evaluacion.py
from typing import TYPE_CHECKING, Optional, List, Any, Dict
from app.extensions import db  # Importar db desde extensions
from datetime import datetime

# Importaciones de tipos para type checking
if TYPE_CHECKING:
    from .leccion import Leccion
    from .pregunta import Pregunta
    from .respuesta import Respuesta


class Evaluacion(db.Model):
    __tablename__ = "evaluaciones"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    titulo = db.Column(db.String(255), nullable=False)
    descripcion = db.Column(db.Text)
    intentos_permitidos = db.Column(db.Integer, default=1)
    tiempo_limite_minutos = db.Column(db.Integer)  # Tiempo límite en minutos
    calificacion_aprobatoria = db.Column(
        db.Float, default=70.0
    )  # Porcentaje mínimo para aprobar
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    fecha_actualizacion = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
    # IA_ASSISTANCE: Criterios para generación de preguntas
    criterios_ia = db.Column(db.Text, nullable=True)

    # Relaciones
    leccion = db.relationship(
        "Leccion",
        back_populates="evaluacion",
        uselist=False,
        cascade="all, delete-orphan",
    )
    preguntas = db.relationship(
        "Pregunta",
        back_populates="evaluacion",
        lazy="dynamic",
        cascade="all, delete-orphan",
    )
    respuestas = db.relationship(
        "Respuesta", back_populates="evaluacion", lazy="dynamic"
    )

    def __repr__(self):
        return f"<Evaluacion {self.id}: {self.titulo}>"

    def to_dict(self):
        """Convierte el objeto Evaluacion a un diccionario."""
        return {
            "id": self.id,
            "titulo": self.titulo,
            "descripcion": self.descripcion,
            "intentos_permitidos": self.intentos_permitidos,
            "tiempo_limite_minutos": self.tiempo_limite_minutos,
            "calificacion_aprobatoria": self.calificacion_aprobatoria,
            "fecha_creacion": self.fecha_creacion.isoformat()
            if self.fecha_creacion
            else None,
            "fecha_actualizacion": self.fecha_actualizacion.isoformat()
            if self.fecha_actualizacion
            else None,
            "total_preguntas": self.preguntas.count(),
            "criterios_ia": self.criterios_ia,
        }

    @classmethod
    def crear_evaluacion(
        cls,
        titulo,
        leccion_id,
        descripcion=None,
        intentos_permitidos=1,
        tiempo_limite_minutos=None,
        calificacion_aprobatoria=70.0,
        criterios_ia=None,
    ):
        """Método de ayuda para crear una nueva evaluación."""
        nueva_evaluacion = cls(
            titulo=titulo,
            descripcion=descripcion,
            intentos_permitidos=intentos_permitidos,
            tiempo_limite_minutos=tiempo_limite_minutos,
            calificacion_aprobatoria=calificacion_aprobatoria,
            criterios_ia=criterios_ia,
        )

        # Asignar la evaluación a la lección
        from .leccion import Leccion

        leccion = Leccion.query.get_or_404(leccion_id)
        leccion.evaluacion = nueva_evaluacion

        db.session.add(nueva_evaluacion)
        db.session.commit()
        return nueva_evaluacion

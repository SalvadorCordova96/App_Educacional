# app/models/leccion.py
from typing import TYPE_CHECKING, Optional, List, Any, Dict
from app.extensions import db  # Importar db desde extensions
from datetime import datetime

# Importaciones de tipos para type checking
if TYPE_CHECKING:
    from .modulo import Modulo
    from .evaluacion import Evaluacion


class Leccion(db.Model):
    __tablename__ = "lecciones"
    __table_args__ = (db.Index("ix_leccion_modulo_id", "modulo_id"),)

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    titulo = db.Column(db.String(255), nullable=False)
    contenido = db.Column(db.Text, nullable=False)
    tipo = db.Column(
        db.String(50), nullable=False
    )  # 'teoria', 'ejercicio', 'evaluacion'
    orden = db.Column(db.Integer, nullable=False)
    duracion_minutos = db.Column(db.Integer)  # Duración estimada en minutos
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    fecha_actualizacion = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Claves foráneas
    modulo_id = db.Column(db.Integer, db.ForeignKey("modulos.id"), nullable=False)
    evaluacion_id = db.Column(db.Integer, db.ForeignKey("evaluaciones.id"))

    # Relaciones
    modulo = db.relationship("Modulo", back_populates="lecciones")
    evaluacion = db.relationship(
        "Evaluacion",
        back_populates="leccion",
        uselist=False,
        single_parent=True,
        cascade="all, delete-orphan",
    )

    def __repr__(self):
        return f"<Leccion {self.id}: {self.titulo} (Módulo: {self.modulo_id})>"

    def to_dict(self):
        """Convierte el objeto Leccion a un diccionario."""
        return {
            "id": self.id,
            "titulo": self.titulo,
            "contenido": self.contenido,
            "tipo": self.tipo,
            "orden": self.orden,
            "duracion_minutos": self.duracion_minutos,
            "modulo_id": self.modulo_id,
            "evaluacion_id": self.evaluacion_id,
            "fecha_creacion": self.fecha_creacion.isoformat()
            if self.fecha_creacion
            else None,
            "fecha_actualizacion": self.fecha_actualizacion.isoformat()
            if self.fecha_actualizacion
            else None,
        }

    @classmethod
    def crear_leccion(
        cls, titulo, contenido, tipo, modulo_id, orden=1, duracion_minutos=None
    ):
        """Método de ayuda para crear una nueva lección."""
        nueva_leccion = cls(
            titulo=titulo,
            contenido=contenido,
            tipo=tipo,
            orden=orden,
            modulo_id=modulo_id,
            duracion_minutos=duracion_minutos,
        )
        db.session.add(nueva_leccion)
        db.session.commit()
        return nueva_leccion

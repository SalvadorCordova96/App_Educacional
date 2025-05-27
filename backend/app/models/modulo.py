# app/models/modulo.py
from typing import TYPE_CHECKING, List, Optional, Any, Dict
from app.extensions import db  # Importar db desde el módulo base
from datetime import datetime, timedelta

# Importaciones de tipos para type checking
if TYPE_CHECKING:
    from .clase import Clase
    from .leccion import Leccion
    from .actividad_colaborativa import ActividadColaborativa


class Modulo(db.Model):
    """Modelo que representa un módulo dentro de una clase."""

    __tablename__ = "modulos"

    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.Text)
    orden = db.Column(db.Integer, nullable=False)
    clase_id = db.Column(db.Integer, db.ForeignKey("clases.id"), nullable=False)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    fecha_actualizacion = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
    ultima_actualizacion = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
    metadatos_colaboracion = db.Column(
        db.JSON, default=lambda: {"comentarios": [], "archivos_vinculados": []}
    )

    # Relaciones
    clase = db.relationship("Clase", back_populates="modulos")
    lecciones = db.relationship(
        "Leccion", back_populates="modulo", lazy="dynamic", cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Módulo {self.titulo} (Clase: {self.clase_id})>"

    def to_dict(self):
        """Convierte el objeto Modulo a un diccionario."""
        return {
            "id": self.id,
            "titulo": self.titulo,
            "descripcion": self.descripcion,
            "orden": self.orden,
            "clase_id": self.clase_id,
            "fecha_creacion": self.fecha_creacion.isoformat()
            if self.fecha_creacion
            else None,
            "fecha_actualizacion": self.fecha_actualizacion.isoformat()
            if self.fecha_actualizacion
            else None,
            "ultima_actualizacion": self.ultima_actualizacion.isoformat()
            if self.ultima_actualizacion
            else None,
            "metadatos_colaboracion": self.metadatos_colaboracion,
            "total_lecciones": self.lecciones.count(),
            "total_actividades": self.actividades.count(),
        }

    @classmethod
    def crear_modulo(cls, titulo, clase_id, descripcion=None, orden=1):
        """Método de ayuda para crear un nuevo módulo."""
        nuevo_modulo = cls(
            titulo=titulo, descripcion=descripcion, clase_id=clase_id, orden=orden
        )
        db.session.add(nuevo_modulo)
        db.session.commit()
        return nuevo_modulo

# --- Agregar relación actividades después de definir ambas clases ---
from .actividad_colaborativa import ActividadColaborativa
Modulo.actividades = db.relationship(
    "ActividadColaborativa",
    backref="modulo",
    lazy="dynamic",
    cascade="all, delete-orphan",
)

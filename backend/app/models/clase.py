# app/models/clase.py
from typing import TYPE_CHECKING, List, Optional, Any, Dict
from app.extensions import db  # Importar db desde extensions
from datetime import datetime

# Importaciones de tipos para type checking
if TYPE_CHECKING:
    from .usuario import Usuario
    from .inscripcion_clase import InscripcionClase
    from .archivo_cargado import ArchivoCargado
    from .mensaje import Mensaje

class Clase(db.Model):
    """Modelo que representa una clase o curso en la plataforma."""

    __tablename__ = "clases"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(255), nullable=False)
    descripcion = db.Column(db.Text, nullable=True)
    imagen_url = db.Column(db.String(512))
    activa = db.Column(db.Boolean, default=True, nullable=False)
    fecha_creacion = db.Column(db.DateTime, default=datetime.utcnow)
    fecha_actualizacion = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
    progreso_grupal = db.Column(
        db.JSON,
        default=lambda: {
            "tareas_completadas": 0,
            "participantes_activos": [],
            "seguimiento_colaborativo": {},
        },
    )

    # Relaciones
    docente_id = db.Column(db.Integer, db.ForeignKey("usuarios.id"), nullable=False)
    docente = db.relationship("Usuario", backref="clases", lazy=True)

    inscripciones = db.relationship("InscripcionClase", back_populates="clase", lazy=True)
    archivos = db.relationship("ArchivoCargado", back_populates="clase", lazy=True)
    modulos = db.relationship("Modulo", back_populates="clase", lazy="dynamic", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Clase {self.id} - {self.nombre}>"

    def to_dict(self):
        """Serialización básica de la clase."""
        return {
            "id": self.id,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "imagen_url": self.imagen_url,
            "activa": self.activa,
            "fecha_creacion": self.fecha_creacion,
            "fecha_actualizacion": self.fecha_actualizacion,
            "progreso_grupal": self.progreso_grupal,
        }

# --- Agregar relación mensajes después de definir ambas clases ---
from .mensaje import Mensaje
Clase.mensajes = db.relationship(
    "Mensaje",
    back_populates="clase",
    cascade="all, delete-orphan",
    lazy="dynamic"
)

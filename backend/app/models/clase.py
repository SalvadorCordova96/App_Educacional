# app/models/clase.py
import secrets
import uuid
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
    codigo_inscripcion = db.Column(db.String(12), unique=True, nullable=True, index=True)

    # Relaciones
    docente_id = db.Column(db.Integer, db.ForeignKey("usuarios.id"), nullable=False)
    docente = db.relationship("Usuario", back_populates="clases_impartidas") # Added as per instructions
    # La línea original: # docente = db.relationship("Usuario", backref="clases", lazy=True) # se mantiene comentada o se elimina.

    inscripciones = db.relationship("InscripcionClase", back_populates="clase", lazy=True)
    archivos = db.relationship("ArchivoCargado", back_populates="clase", lazy='dynamic', cascade='all, delete-orphan') # Updated
    modulos = db.relationship("Modulo", back_populates="clase", lazy="dynamic", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Clase {self.id} - {self.nombre}>"

    def to_dict(self):
        """Serialización básica de la clase."""
        data = {
            "id": self.id,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "imagen_url": self.imagen_url,
            "activa": self.activa,
            "fecha_creacion": self.fecha_creacion.isoformat() if self.fecha_creacion else None,
            "fecha_actualizacion": self.fecha_actualizacion.isoformat() if self.fecha_actualizacion else None,
            "progreso_grupal": self.progreso_grupal,
            "docente_id": self.docente_id,
        }
        if self.codigo_inscripcion:
            data["codigo_inscripcion"] = self.codigo_inscripcion
        return data

    @staticmethod
    def generar_codigo_inscripcion(longitud=8):
        """Genera un código de inscripción único y más corto."""
        # Combina parte de un UUID con caracteres aleatorios para asegurar unicidad y aleatoriedad
        # Usar primeros 4 caracteres de un UUID y 4 caracteres aleatorios seguros
        # Esto da 16^4 * (36+26)^4 combinaciones, que es grande, pero para 8 caracteres puede haber colisiones
        # Mejor usar secrets.token_urlsafe para mayor aleatoriedad en una longitud corta
        # longitud de 8 con token_urlsafe da (64^8) posibilidades, muy alta.
        # Para 12 caracteres: (64^12)
        
        # Generar un código corto y legible. Base32 sin '0', '1', 'I', 'O' para evitar confusiones.
        # Python secrets.choice no existe. Usar secrets.token_hex o token_urlsafe y truncar/procesar.
        # Un código de 8 caracteres alfanuméricos (mayúsculas y números) tiene (26+10)^8 = 36^8 posibilidades
        # alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' # Sin 0,1,I,O,S,U,V,Z para legibilidad
        # codigo = ''.join(secrets.choice(alfabeto) for i in range(longitud))

        # Usaremos token_urlsafe y lo haremos más corto y limpio.
        # token_urlsafe(nbytes) genera nbytes * 1.33 caracteres aprox.
        # Para 8 caracteres, nbytes=6. Para 12 caracteres, nbytes=9.
        
        codigo_generado = secrets.token_urlsafe(9)[:longitud] # Genera 12 caracteres seguros
        
        # Asegurar unicidad
        while Clase.query.filter_by(codigo_inscripcion=codigo_generado).first():
            codigo_generado = secrets.token_urlsafe(9)[:longitud]
        return codigo_generado

# --- Agregar relación mensajes después de definir ambas clases ---
from .mensaje import Mensaje
Clase.mensajes = db.relationship(
    "Mensaje",
    back_populates="clase",
    cascade="all, delete-orphan",
    lazy="dynamic"
)

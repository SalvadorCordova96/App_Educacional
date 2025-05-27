# backend/app/models.py
# Este archivo ahora es un módulo de importación que reexporta los modelos definidos en archivos individuales
# Mantenemos este archivo por compatibilidad con código existente

# Importar la instancia de SQLAlchemy (db) desde app/__init__.py
from . import db

# Importar todos los modelos de sus respectivos archivos
from .models.usuario import Usuario
from .models.clase import Clase
from .models.modulo import Modulo
from .models.leccion import Leccion
from .models.evaluacion import Evaluacion
from .models.pregunta import Pregunta
from .models.opcion_respuesta import OpcionRespuesta
from .models.respuesta import Respuesta
from .models.inscripcion_clase import InscripcionClase

# Hacer que los modelos estén disponibles para importaciones directas desde app.models
__all__ = [
    "db",  # Exportar la instancia de SQLAlchemy
    "Usuario",
    "Clase",
    "Modulo",
    "Leccion",
    "Evaluacion",
    "Pregunta",
    "OpcionRespuesta",
    "Respuesta",
    "InscripcionClase",
]

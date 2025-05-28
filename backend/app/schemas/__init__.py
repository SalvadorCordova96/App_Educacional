# app/schemas/__init__.py
# Re-exportar todos los esquemas para facilitar las importaciones

# Importar esquemas base
from .base_schemas import BaseSchema, BaseSQLAlchemySchema, PaginacionSchema, ErrorSchema, SuccessSchema, AuthResponseSchema

# Importar esquemas de modelos
from .usuario_schemas import (
    UsuarioSchema,
    UsuarioLoginSchema,
    UsuarioRegistroSchema,
    CambioPasswordSchema,
    UsuarioActualizacionSchema,
)

from .clase_schemas import (
    ClaseSchema,
    ClaseCreateSchema,
    ClaseUpdateSchema,
    ClaseConModulosSchema,
    ClaseEstadisticasSchema,
)

from .modulo_schemas import (
    ModuloSchema,
    ModuloCreateSchema,
    ModuloUpdateSchema,
    ModuloConLeccionesSchema,
)

from .leccion_schemas import (
    LeccionSchema,
    LeccionCreateSchema,
    LeccionUpdateSchema,
    LeccionConEvaluacionSchema,
)

from .evaluacion_schemas import (
    EvaluacionSchema,
    EvaluacionCreateSchema,
    EvaluacionUpdateSchema,
    EvaluacionConPreguntasSchema,
    ResultadoEvaluacionSchema,
)

from .pregunta_schemas import (
    PreguntaSchema,
    PreguntaCreateSchema,
    PreguntaUpdateSchema,
    PreguntaConOpcionesSchema,
    OpcionRespuestaSchema,
    OpcionRespuestaCreateSchema,
)

from .respuesta_schemas import (
    RespuestaSchema,
    RespuestaCreateSchema,
    RespuestaEnvioSchema,
    RespuestaCalificacionSchema,
)

from .inscripcion_schemas import (
    InscripcionClaseSchema,
    InscripcionCreateSchema,
    InscripcionUpdateSchema,
    InscripcionConProgresoDetalladoSchema,
    ProgresoEstudianteSchema,
)

from .archivo_cargado_schemas import ArchivoCargadoSchema  # ArchivoCargadoCreateSchema removed

from .mensaje_schemas import MensajeSchema # Added import for MensajeSchema

# Exportar todos los esquemas para facilitar las importaciones
__all__ = [
    # Esquemas base
    "BaseSchema",
    "BaseSQLAlchemySchema",
    "PaginacionSchema",
    "ErrorSchema", # Added
    "SuccessSchema", # Added
    "AuthResponseSchema", # Added
    # Usuarios
    "UsuarioSchema",
    "UsuarioLoginSchema",
    "UsuarioRegistroSchema",
    "CambioPasswordSchema",
    "UsuarioActualizacionSchema",
    # Clases
    "ClaseSchema",
    "ClaseCreateSchema",
    "ClaseUpdateSchema",
    "ClaseConModulosSchema",
    "ClaseEstadisticasSchema",
    # Módulos
    "ModuloSchema",
    "ModuloCreateSchema",
    "ModuloUpdateSchema",
    "ModuloConLeccionesSchema",
    # Lecciones
    "LeccionSchema",
    "LeccionCreateSchema",
    "LeccionUpdateSchema",
    "LeccionConEvaluacionSchema",
    # Evaluaciones
    "EvaluacionSchema",
    "EvaluacionCreateSchema",
    "EvaluacionUpdateSchema",
    "EvaluacionConPreguntasSchema",
    "ResultadoEvaluacionSchema",
    # Preguntas
    "PreguntaSchema",
    "PreguntaCreateSchema",
    "PreguntaUpdateSchema",
    "PreguntaConOpcionesSchema",
    "OpcionRespuestaSchema",
    "OpcionRespuestaCreateSchema",
    # Respuestas
    "RespuestaSchema",
    "RespuestaCreateSchema",
    "RespuestaEnvioSchema",
    "RespuestaCalificacionSchema",
    # Inscripciones
    "InscripcionClaseSchema",
    "InscripcionCreateSchema",
    "InscripcionUpdateSchema",
    "InscripcionConProgresoDetalladoSchema",
    "ProgresoEstudianteSchema",
    # Archivos cargados
    "ArchivoCargadoSchema", # ArchivoCargadoCreateSchema removed from __all__
    # Mensajes
    "MensajeSchema", # Added MensajeSchema to __all__
]

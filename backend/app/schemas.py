# backend/app/schemas.py
# Este archivo ahora es un módulo de importación que reexporta todos los esquemas
# Los esquemas están organizados en módulos separados en el directorio app/schemas/

# Importar esquemas base
from .schemas.base_schemas import BaseSchema, BaseSQLAlchemySchema, PaginacionSchema

# Importar todos los esquemas de modelos
from .schemas.usuario_schemas import (
    UsuarioSchema,
    UsuarioLoginSchema,
    UsuarioRegistroSchema,
    CambioPasswordSchema,
    UsuarioActualizacionSchema,
)

from .schemas.clase_schemas import (
    ClaseSchema,
    ClaseCreateSchema,
    ClaseUpdateSchema,
    ClaseConModulosSchema,
    ClaseEstadisticasSchema,
)

from .schemas.modulo_schemas import (
    ModuloSchema,
    ModuloCreateSchema,
    ModuloUpdateSchema,
    ModuloConLeccionesSchema,
)

from .schemas.leccion_schemas import (
    LeccionSchema,
    LeccionCreateSchema,
    LeccionUpdateSchema,
    LeccionConEvaluacionSchema,
)

from .schemas.evaluacion_schemas import (
    EvaluacionSchema,
    EvaluacionCreateSchema,
    EvaluacionUpdateSchema,
    EvaluacionConPreguntasSchema,
    ResultadoEvaluacionSchema,
)

from .schemas.pregunta_schemas import (
    PreguntaSchema,
    PreguntaCreateSchema,
    PreguntaUpdateSchema,
    PreguntaConOpcionesSchema,
    OpcionRespuestaSchema,
    OpcionRespuestaCreateSchema,
)

from .schemas.respuesta_schemas import (
    RespuestaSchema,
    RespuestaCreateSchema,
    RespuestaEnvioSchema,
    RespuestaCalificacionSchema,
)

from .schemas.inscripcion_schemas import (
    InscripcionClaseSchema,
    InscripcionCreateSchema,
    InscripcionUpdateSchema,
    InscripcionConProgresoDetalladoSchema,
    ProgresoEstudianteSchema,
)


# Esquemas base y de utilidad
class ErrorSchema(BaseSchema):
    """
    Esquema estándar para respuestas de error.
    """

    status = fields.Str(default="error")
    message = fields.Str()
    errors = fields.Dict(keys=fields.Str(), values=fields.List(fields.Str()))


class SuccessSchema(BaseSchema):
    """
    Esquema estándar para respuestas exitosas.
    """

    status = fields.Str(default="success")
    message = fields.Str()
    data = fields.Dict()


class AuthResponseSchema(SuccessSchema):
    """
    Esquema para la respuesta de autenticación exitosa.
    """

    access_token = fields.Str()
    refresh_token = fields.Str()
    user = fields.Method("get_user_data")

    def get_user_data(self, obj):
        user = obj.get("user")
        return {
            "id": user.id,
            "nombre_completo": user.nombre_completo,
            "correo_electronico": user.correo_electronico,
            "rol": user.rol,
        }


# Hacer que los esquemas estén disponibles para importaciones directas
__all__ = [
    # Esquemas base
    "BaseSchema",
    "BaseSQLAlchemySchema",
    "PaginacionSchema",
    "ErrorSchema",
    "SuccessSchema",
    "AuthResponseSchema",
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
]

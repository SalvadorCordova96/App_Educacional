# app/schemas/respuesta_schemas.py
from marshmallow import fields, validate, validates_schema, ValidationError
from ..models import Respuesta, Pregunta
from .base_schemas import (
    BaseSQLAlchemySchema,
    BaseSchema,
    validar_longitud_minima,
    validar_longitud_maxima,
)


class RespuestaSchema(BaseSQLAlchemySchema):
    """
    Esquema para serializar/deserializar objetos Respuesta.
    """

    class Meta:
        model = Respuesta
        load_instance = True

    id = fields.Int(dump_only=True)
    texto_respuesta = fields.Str(allow_none=True)
    calificacion = fields.Float(validate=validate.Range(min=0), allow_none=True)
    retroalimentacion = fields.Str(
        validate=validar_longitud_maxima(1000), allow_none=True
    )
    fecha_respuesta = fields.DateTime(dump_only=True)
    tiempo_tomado = fields.Int(
        description="Tiempo tomado en segundos", validate=validate.Range(min=0)
    )
    intento_numero = fields.Int(validate=validate.Range(min=1), default=1)

    # Claves foráneas
    pregunta_id = fields.Int(required=True, load_only=True)
    estudiante_id = fields.Int(required=True, load_only=True)
    evaluacion_id = fields.Int(required=True, load_only=True)
    opcion_seleccionada_id = fields.Int(allow_none=True, load_only=True)

    # Relaciones
    pregunta = fields.Nested(
        "PreguntaSchema", only=("id", "enunciado", "tipo", "puntaje"), dump_only=True
    )
    estudiante = fields.Nested(
        "UsuarioSchema", only=("id", "nombre_completo"), dump_only=True
    )
    evaluacion = fields.Nested(
        "EvaluacionSchema", only=("id", "titulo"), dump_only=True
    )
    opcion_seleccionada = fields.Nested("OpcionRespuestaSchema", dump_only=True)


class RespuestaCreateSchema(BaseSchema):
    """
    Esquema para validar la creación de una nueva respuesta.
    """

    # Para preguntas de opción múltiple o verdadero/falso
    opcion_seleccionada_id = fields.Int(required=False, allow_none=True)

    # Para preguntas de respuesta corta
    texto_respuesta = fields.Str(
        required=False, allow_none=True, validate=validar_longitud_maxima(2000)
    )

    # Tiempo que tomó responder la pregunta (en segundos)
    tiempo_tomado = fields.Int(required=True, validate=validate.Range(min=0))

    # Número de intento (se valida contra el número de intentos permitidos en la evaluación)
    intento_numero = fields.Int(required=True, validate=validate.Range(min=1))

    # La pregunta_id, estudiante_id y evaluacion_id vienen de la URL o del token

    @validates_schema
    def validate_respuesta(self, data, **kwargs):
        # Verificar que se proporcione al menos una respuesta
        if not any(
            [
                data.get("opcion_seleccionada_id") is not None,
                data.get("texto_respuesta") is not None,
            ]
        ):
            raise ValidationError("Se debe proporcionar una respuesta (opción o texto)")

        # Verificar que no se envíen ambos tipos de respuesta
        if (
            data.get("opcion_seleccionada_id") is not None
            and data.get("texto_respuesta") is not None
        ):
            raise ValidationError(
                "Solo se puede proporcionar una opción o un texto, no ambos"
            )


class RespuestaEnvioSchema(BaseSchema):
    """
    Esquema para validar el envío de respuestas a una evaluación.
    Contiene múltiples respuestas a diferentes preguntas.
    """

    respuestas = fields.List(
        fields.Nested(RespuestaCreateSchema),
        required=True,
        validate=validate.Length(
            min=1, error="Debe proporcionar al menos una respuesta"
        ),
    )

    # Tiempo total que tomó completar la evaluación (en segundos)
    tiempo_total = fields.Int(required=True, validate=validate.Range(min=0))

    # Número de intento (debe ser consistente en todas las respuestas)
    intento_numero = fields.Int(required=True, validate=validate.Range(min=1))

    @validates_schema
    def validate_respuestas_consistencia(self, data, **kwargs):
        # Verificar que todas las respuestas tengan el mismo intento_numero
        respuestas = data.get("respuestas", [])
        if respuestas and any(
            r.get("intento_numero") != data["intento_numero"] for r in respuestas
        ):
            raise ValidationError(
                "Todas las respuestas deben tener el mismo número de intento"
            )


class RespuestaCalificacionSchema(BaseSchema):
    """
    Esquema para calificar manualmente una respuesta.
    """

    calificacion = fields.Float(required=True, validate=validate.Range(min=0))
    retroalimentacion = fields.Str(
        validate=validar_longitud_maxima(1000), allow_none=True, missing=None
    )

    @validates_schema
    def validate_calificacion(self, data, **kwargs):
        # La calificación no puede ser mayor al puntaje máximo de la pregunta
        # Esto se validará en la vista con los datos reales de la pregunta
        pass

# app/schemas/pregunta_schemas.py
from marshmallow import fields, validate, validates, ValidationError, EXCLUDE
from marshmallow_sqlalchemy import auto_field
from datetime import datetime
from .base_schemas import BaseSchema, BaseSQLAlchemySchema, PaginacionSchema
from ..models.pregunta import Pregunta


class OpcionRespuestaSchema(BaseSQLAlchemySchema):
    """
    Esquema para la serialización/deserialización de opciones de respuesta.
    """

    class Meta:
        model = "OpcionRespuesta"
        load_instance = True
        unknown = EXCLUDE

    id = auto_field(dump_only=True)
    texto = fields.Str(
        required=True,
        validate=validate.Length(
            min=1,
            max=1000,
            error="El texto de la opción debe tener entre 1 y 1000 caracteres",
        ),
    )
    es_correcta = fields.Bool(required=True)
    retroalimentacion = fields.Str(
        validate=validate.Length(
            max=2000, error="La retroalimentación no puede exceder los 2000 caracteres"
        ),
        allow_none=True,
    )
    orden = fields.Int(
        required=True,
        validate=validate.Range(
            min=0, error="El orden debe ser un número positivo o cero"
        ),
    )
    pregunta_id = auto_field(load_only=True)

    @validates("texto")
    def validate_texto(self, value):
        """Valida que el texto no esté vacío."""
        if not value or not value.strip():
            raise ValidationError("El texto de la opción no puede estar vacío")


class PreguntaSchema(BaseSQLAlchemySchema):
    """
    Esquema para la serialización/deserialización de objetos Pregunta.
    """

    class Meta:
        model = Pregunta
        load_instance = True
        include_fk = True
        unknown = EXCLUDE

    id = auto_field(dump_only=True)

    enunciado = auto_field(
        required=True,
        validate=validate.Length(
            min=3, max=1000, error="El enunciado debe tener entre 3 y 1000 caracteres"
        ),
    )

    tipo = auto_field(
        required=True,
        validate=validate.OneOf(
            [
                "opcion_unica",
                "opcion_multiple",
                "verdadero_falso",
                "respuesta_corta",
                "respuesta_larga",
            ],
            error="Tipo de pregunta no válido. Debe ser 'opcion_unica', 'opcion_multiple', 'verdadero_falso', 'respuesta_corta' o 'respuesta_larga'",
        ),
    )

    puntaje = auto_field(
        required=True,
        validate=validate.Range(
            min=0.1, max=100, error="El puntaje debe ser un valor entre 0.1 y 100"
        ),
    )

    retroalimentacion = auto_field(
        validate=validate.Length(
            max=2000, error="La retroalimentación no puede exceder los 2000 caracteres"
        ),
        allow_none=True,
    )

    orden = auto_field(
        required=True,
        validate=validate.Range(
            min=1, error="El orden debe ser un número positivo mayor que cero"
        ),
    )

    es_obligatoria = auto_field(
        load_default=True,
        error_messages={
            "invalid": "El campo es_obligatoria debe ser un valor booleano"
        },
    )

    fecha_creacion = auto_field(dump_only=True)
    fecha_actualizacion = auto_field(dump_only=True)

    # Relaciones
    evaluacion_id = auto_field(required=True, load_only=True)

    evaluacion = fields.Nested(
        "EvaluacionSchema", only=("id", "titulo", "leccion_id"), dump_only=True
    )

    opciones = fields.Nested(
        "OpcionRespuestaSchema", many=True, exclude=("pregunta",), dump_only=True
    )

    # Validaciones personalizadas
    @validates("enunciado")
    def validate_enunciado(self, value):
        """Valida que el enunciado no esté vacío."""
        if not value or not value.strip():
            raise ValidationError("El enunciado no puede estar vacío")

    @validates("puntaje")
    def validate_puntaje(self, value):
        """Valida que el puntaje tenga como máximo 2 decimales."""
        if value is not None and (value * 100) % 1 != 0:
            raise ValidationError("El puntaje no puede tener más de 2 decimales")

    @validates("opciones")
    def validate_opciones(self, value):
        """Valida las opciones según el tipo de pregunta."""
        if value:
            if self.tipo in ["opcion_unica", "opcion_multiple"] and not value:
                raise ValidationError(
                    "Las preguntas de opción única/múltiple deben tener al menos una opción"
                )

            if self.tipo in ["opcion_unica", "opcion_multiple"]:
                opciones_correctas = [op for op in value if op.get("es_correcta")]
                if not opciones_correctas:
                    raise ValidationError("Debe haber al menos una opción correcta")

                if self.tipo == "opcion_unica" and len(opciones_correctas) > 1:
                    raise ValidationError(
                        "Las preguntas de opción única solo pueden tener una opción correcta"
                    )

                # Validar que no haya opciones duplicadas
                textos = [
                    op.get("texto", "").strip().lower()
                    for op in value
                    if op.get("texto")
                ]
                if len(textos) != len(set(textos)):
                    raise ValidationError("No pueden existir opciones duplicadas")

    def load(self, data, many=None, partial=None, **kwargs):
        """Sobrescribe el método load para incluir validaciones adicionales después de cargar."""
        result = super().load(data, many=many, partial=partial, **kwargs)

        # Validar las opciones después de cargar los datos
        if hasattr(self, "tipo") and hasattr(self, "opciones"):
            self.validate_opciones(self.opciones)

        return result


class PreguntaCreateSchema(BaseSchema):
    """
    Esquema para la creación de nuevas preguntas.
    """

    enunciado = fields.Str(
        required=True,
        validate=validate.Length(
            min=3, max=1000, error="El enunciado debe tener entre 3 y 1000 caracteres"
        ),
    )

    tipo = fields.Str(
        required=True,
        validate=validate.OneOf(
            [
                "opcion_unica",
                "opcion_multiple",
                "verdadero_falso",
                "respuesta_corta",
                "respuesta_larga",
            ],
            error="Tipo de pregunta no válido. Debe ser 'opcion_unica', 'opcion_multiple', 'verdadero_falso', 'respuesta_corta' o 'respuesta_larga'",
        ),
    )

    puntaje = fields.Float(
        required=True,
        validate=validate.Range(
            min=0.1, max=100, error="El puntaje debe ser un valor entre 0.1 y 100"
        ),
    )

    retroalimentacion = fields.Str(
        validate=validate.Length(
            max=2000, error="La retroalimentación no puede exceder los 2000 caracteres"
        ),
        allow_none=True,
    )

    orden = fields.Int(
        required=True,
        validate=validate.Range(
            min=1, error="El orden debe ser un número positivo mayor que cero"
        ),
    )

    es_obligatoria = fields.Bool(
        load_default=True,
        error_messages={
            "invalid": "El campo es_obligatoria debe ser un valor booleano"
        },
    )

    evaluacion_id = fields.Int(
        required=True,
        validate=validate.Range(
            min=1, error="El ID de la evaluación debe ser un número positivo"
        ),
    )

    opciones = fields.Nested("OpcionRespuestaCreateSchema", many=True, required=False)

    # Validaciones personalizadas
    @validates("enunciado")
    def validate_enunciado(self, value):
        """Valida que el enunciado no esté vacío."""
        if not value or not value.strip():
            raise ValidationError("El enunciado no puede estar vacío")

    @validates("puntaje")
    def validate_puntaje(self, value):
        """Valida que el puntaje tenga como máximo 2 decimales."""
        if value is not None and (value * 100) % 1 != 0:
            raise ValidationError("El puntaje no puede tener más de 2 decimales")

    @validates("opciones")
    def validate_opciones(self, value):
        """Valida las opciones según el tipo de pregunta."""
        if value:
            tipo = self.get("tipo")
            if tipo in ["opcion_unica", "opcion_multiple"] and not value:
                raise ValidationError(
                    "Las preguntas de opción única/múltiple deben tener al menos una opción"
                )

            if tipo in ["opcion_unica", "opcion_multiple"]:
                opciones_correctas = [op for op in value if op.get("es_correcta")]
                if not opciones_correctas:
                    raise ValidationError("Debe haber al menos una opción correcta")

                if tipo == "opcion_unica" and len(opciones_correctas) > 1:
                    raise ValidationError(
                        "Las preguntas de opción única solo pueden tener una opción correcta"
                    )

                # Validar que no haya opciones duplicadas
                textos = [
                    op.get("texto", "").strip().lower()
                    for op in value
                    if op.get("texto")
                ]
                if len(textos) != len(set(textos)):
                    raise ValidationError("No pueden existir opciones duplicadas")

    def load(self, data, many=None, partial=None, **kwargs):
        """Sobrescribe el método load para incluir validaciones adicionales después de cargar."""
        result = super().load(data, many=many, partial=partial, **kwargs)

        # Validar las opciones después de cargar los datos
        if "opciones" in data and "tipo" in data:
            self.validate_opciones(data["opciones"])

        return result


class PreguntaUpdateSchema(BaseSchema):
    """
    Esquema para la actualización de preguntas existentes.
    """

    enunciado = fields.Str(
        validate=validate.Length(
            min=3, max=1000, error="El enunciado debe tener entre 3 y 1000 caracteres"
        ),
        allow_none=True,
    )

    tipo = fields.Str(
        validate=validate.OneOf(
            [
                "opcion_unica",
                "opcion_multiple",
                "verdadero_falso",
                "respuesta_corta",
                "respuesta_larga",
            ],
            error="Tipo de pregunta no válido",
        ),
        allow_none=True,
    )

    puntaje = fields.Float(
        validate=validate.Range(
            min=0.1, max=100, error="El puntaje debe ser un valor entre 0.1 y 100"
        ),
        allow_none=True,
    )

    retroalimentacion = fields.Str(
        validate=validate.Length(
            max=2000, error="La retroalimentación no puede exceder los 2000 caracteres"
        ),
        allow_none=True,
    )

    orden = fields.Int(
        validate=validate.Range(
            min=1, error="El orden debe ser un número positivo mayor que cero"
        ),
        allow_none=True,
    )

    es_obligatoria = fields.Bool(allow_none=True)

    opciones = fields.Nested("OpcionRespuestaUpdateSchema", many=True, required=False)

    @validates("enunciado")
    def validate_enunciado(self, value):
        """Valida que el enunciado no esté vacío si se proporciona."""
        if value is not None and not value.strip():
            raise ValidationError("El enunciado no puede estar vacío")

    @validates("puntaje")
    def validate_puntaje(self, value):
        """Valida que el puntaje tenga como máximo 2 decimales."""
        if value is not None and (value * 100) % 1 != 0:
            raise ValidationError("El puntaje no puede tener más de 2 decimales")


class PreguntaConOpcionesSchema(PreguntaSchema):
    """
    Esquema que incluye las opciones de respuesta de la pregunta.
    """

    opciones = fields.Nested(
        OpcionRespuestaSchema, many=True, exclude=("pregunta",), dump_only=True
    )


class PreguntaPaginacionSchema(PaginacionSchema):
    """
    Esquema para la paginación de preguntas.
    """

    items = fields.Nested(PreguntaSchema, many=True, dump_only=True)


class OpcionRespuestaCreateSchema(BaseSchema):
    """
    Esquema para la creación de nuevas opciones de respuesta.
    """

    texto = fields.Str(
        required=True,
        validate=validate.Length(
            min=1,
            max=1000,
            error="El texto de la opción debe tener entre 1 y 1000 caracteres",
        ),
    )
    es_correcta = fields.Bool(required=True)
    retroalimentacion = fields.Str(
        validate=validate.Length(
            max=2000, error="La retroalimentación no puede exceder los 2000 caracteres"
        ),
        allow_none=True,
    )
    orden = fields.Int(
        required=True,
        validate=validate.Range(
            min=0, error="El orden debe ser un número positivo o cero"
        ),
    )

    @validates("texto")
    def validate_texto(self, value):
        """Valida que el texto no esté vacío."""
        if not value or not value.strip():
            raise ValidationError("El texto de la opción no puede estar vacío")


class OpcionRespuestaUpdateSchema(BaseSchema):
    """
    Esquema para la actualización de opciones de respuesta existentes.
    """

    texto = fields.Str(
        validate=validate.Length(
            min=1,
            max=1000,
            error="El texto de la opción debe tener entre 1 y 1000 caracteres",
        ),
        allow_none=True,
    )
    es_correcta = fields.Bool(allow_none=True)
    retroalimentacion = fields.Str(
        validate=validate.Length(
            max=2000, error="La retroalimentación no puede exceder los 2000 caracteres"
        ),
        allow_none=True,
    )
    orden = fields.Int(
        validate=validate.Range(
            min=0, error="El orden debe ser un número positivo o cero"
        ),
        allow_none=True,
    )

    @validates("texto")
    def validate_texto(self, value):
        """Valida que el texto no esté vacío si se proporciona."""
        if value is not None and not value.strip():
            raise ValidationError("El texto de la opción no puede estar vacío")

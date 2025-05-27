# app/schemas/inscripcion_schemas.py
from marshmallow import fields, validate, validates_schema, ValidationError
from ..models import InscripcionClase
from .base_schemas import BaseSQLAlchemySchema, BaseSchema, validar_porcentaje

# Validadores específicos para inscripciones
validar_estado_inscripcion = validate.OneOf(
    ["activo", "completado", "abandonado"],
    error="El estado debe ser 'activo', 'completado' o 'abandonado'",
)


class InscripcionClaseSchema(BaseSQLAlchemySchema):
    """
    Esquema para serializar/deserializar objetos Inscripción a Clase.
    """

    class Meta:
        model = InscripcionClase
        load_instance = True

    id = fields.Int(dump_only=True)
    fecha_inscripcion = fields.DateTime(dump_only=True)
    estado = fields.Str(validate=validar_estado_inscripcion, default="activo")
    progreso = fields.Float(validate=validar_porcentaje, default=0.0)
    ultimo_acceso = fields.DateTime(allow_none=True)
    fecha_completado = fields.DateTime(allow_none=True)
    calificacion_final = fields.Float(
        validate=validate.Range(min=0, max=100), allow_none=True
    )

    # Claves foráneas
    estudiante_id = fields.Int(required=True, load_only=True)
    clase_id = fields.Int(required=True, load_only=True)

    # Relaciones
    estudiante = fields.Nested(
        "UsuarioSchema",
        only=("id", "nombre_completo", "correo_electronico"),
        dump_only=True,
    )
    clase = fields.Nested(
        "ClaseSchema",
        only=("id", "titulo", "descripcion", "imagen_url"),
        dump_only=True,
    )

    # Campos calculados
    tiempo_estudiado = fields.Method("get_tiempo_estudiado", dump_only=True)

    def get_tiempo_estudiado(self, obj):
        # Este método debería calcular el tiempo total que el estudiante ha dedicado a la clase
        # Dependerá de cómo se registre el tiempo de estudio en tu aplicación
        return 0  # Implementar según la lógica de negocio


class InscripcionCreateSchema(BaseSchema):
    """
    Esquema para validar la creación de una nueva inscripción.
    """

    # El estudiante_id generalmente se obtiene del token JWT
    # La clase_id se pasa como parámetro en la URL

    # Campos opcionales con valores por defecto
    estado = fields.Str(validate=validar_estado_inscripcion, missing="activo")

    # No se permite establecer progreso, calificación, etc. al crear la inscripción


class InscripcionUpdateSchema(BaseSchema):
    """
    Esquema para validar la actualización de una inscripción existente.
    """

    estado = fields.Str(validate=validar_estado_inscripcion)
    progreso = fields.Float(validate=validar_porcentaje)
    calificacion_final = fields.Float(
        validate=validate.Range(min=0, max=100), allow_none=True
    )

    @validates_schema
    def validate_not_empty(self, data, **kwargs):
        if not data:
            raise ValidationError("No se proporcionaron datos para actualizar")

        # Validar que si se marca como completado, el progreso sea 100%
        if (
            data.get("estado") == "completado"
            and "progreso" in data
            and data["progreso"] < 100
        ):
            raise ValidationError(
                "No se puede marcar como completado con un progreso menor al 100%"
            )

        # Si se actualiza el progreso a 100%, marcar automáticamente como completado
        if data.get("progreso") == 100 and data.get("estado") != "abandonado":
            data["estado"] = "completado"


class InscripcionConProgresoDetalladoSchema(InscripcionClaseSchema):
    """
    Esquema que incluye información detallada del progreso del estudiante en la clase.
    """

    # Información de módulos completados
    modulos_completados = fields.List(
        fields.Dict(), description="Lista de módulos completados con su progreso"
    )

    # Próximos módulos sugeridos
    proximos_modulos = fields.List(
        fields.Dict(), description="Lista de los próximos módulos sugeridos"
    )

    # Estadísticas de la clase
    estadisticas = fields.Dict(description="Estadísticas de progreso en la clase")


class ProgresoEstudianteSchema(BaseSchema):
    """
    Esquema para el progreso detallado de un estudiante en una clase.
    """

    clase_id = fields.Int(required=True)
    clase_titulo = fields.Str(required=True)
    progreso_global = fields.Float(required=True, validate=validar_porcentaje)
    fecha_inscripcion = fields.DateTime(required=True)
    ultimo_acceso = fields.DateTime(allow_none=True)
    estado = fields.Str(required=True, validate=validar_estado_inscripcion)

    # Detalle por módulo
    modulos = fields.List(
        fields.Dict(keys=fields.Str(), values=fields.Raw()), required=True
    )

    # Actividad reciente
    actividad_reciente = fields.List(
        fields.Dict(keys=fields.Str(), values=fields.Raw()), required=True
    )

    # Calificaciones de evaluaciones
    evaluaciones = fields.List(
        fields.Dict(keys=fields.Str(), values=fields.Raw()), required=True
    )

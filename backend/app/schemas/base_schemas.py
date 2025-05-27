# app/schemas/base_schemas.py
from marshmallow import (
    Schema,
    fields,
    validate,
    validates_schema,
    ValidationError,
    EXCLUDE,
)
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema, auto_field
from datetime import datetime
from .validators import validate_date_not_in_past, validate_positive_number


class BaseSchema(Schema):
    """Clase base para todos los esquemas que proporciona métodos comunes."""

    class Meta:
        ordered = True  # Mantener el orden de los campos
        unknown = EXCLUDE  # Ignorar campos desconocidos

    # Campos comunes
    id = fields.Int(dump_only=True)
    fecha_creacion = fields.DateTime(dump_only=True)
    fecha_actualizacion = fields.DateTime(dump_only=True)

    # Métodos de utilidad
    def handle_error(self, exc, data, **kwargs):
        """Maneja errores de validación."""
        from .error_handlers import handle_validation_error

        return handle_validation_error(exc)


class PaginacionSchema(BaseSchema):
    """
    Esquema para la respuesta de paginación.
    """

    pagina = fields.Int(
        load_default=1,
        validate=validate.Range(
            min=1, error="El número de página debe ser mayor o igual a 1"
        ),
    )
    por_pagina = fields.Int(
        load_default=10,
        validate=validate.Range(
            min=1,
            max=100,
            error="El número de elementos por página debe estar entre 1 y 100",
        ),
    )
    total = fields.Int(dump_only=True)
    paginas = fields.Int(dump_only=True)
    tiene_siguiente = fields.Bool(dump_only=True)
    tiene_anterior = fields.Bool(dump_only=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Validar que los parámetros de paginación sean válidos
        if hasattr(self, "pagina") and hasattr(self, "por_pagina"):
            validate_positive_number(self.pagina, "página")
            validate_positive_number(self.por_pagina, "elementos por página")


class BaseSQLAlchemySchema(SQLAlchemyAutoSchema):
    """
    Clase base para esquemas SQLAlchemy que incluye configuración común.
    Las clases hijas DEBEN especificar su modelo en la clase Meta.
    """

    class Meta:
        ordered = True  # Mantener el orden de los campos
        include_fk = True  # Incluir claves foráneas
        load_instance = True  # Cargar instancias del modelo directamente
        sqla_session = None  # Se establecerá en create_app
        include_relationships = True

    # Configuración común de campos
    id = fields.Int(dump_only=True)
    fecha_creacion = fields.DateTime(dump_only=True, format="iso")
    fecha_actualizacion = fields.DateTime(dump_only=True, format="iso")

    def handle_error(self, error, data, **kwargs):
        """
        Maneja los errores de validación de manera consistente.
        """
        raise ValidationError(
            {
                "status": "error",
                "message": "Error de validación",
                "errors": error.messages,
            }
        )


# Validadores comunes
validar_email = validate.Email(error="Debe ser un correo electrónico válido")
validar_longitud_minima = lambda min_len: validate.Length(
    min=min_len, error=f"Debe tener al menos {min_len} caracteres"
)
validar_longitud_maxima = lambda max_len: validate.Length(
    max=max_len, error=f"No debe exceder los {max_len} caracteres"
)
validar_solo_letras = validate.Regexp(
    r"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$", error="Solo se permiten letras y espacios"
)
validar_alfanumerico = validate.Regexp(
    r"^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-_]+$",
    error="Solo se permiten letras, números, espacios, guiones y guiones bajos",
)
validar_contraseña = validate.Regexp(
    r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
    error="La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial",
)


# Validadores personalizados
def validar_fecha_futura(fecha):
    """Valida que la fecha no sea futura."""
    if fecha and fecha > datetime.utcnow():
        raise ValidationError("La fecha no puede ser futura")


def validar_fecha_pasada(fecha):
    """Valida que la fecha sea pasada o presente."""
    if fecha and fecha < datetime.utcnow():
        raise ValidationError("La fecha no puede ser pasada")


def validar_porcentaje(valor):
    """Valida que el valor esté entre 0 y 100."""
    if valor is not None and (valor < 0 or valor > 100):
        raise ValidationError("El porcentaje debe estar entre 0 y 100")


# Esquemas comunes
# La clase PaginacionSchema ya está definida anteriormente en el archivo

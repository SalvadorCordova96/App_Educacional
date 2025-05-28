# app/schemas/usuario_schemas.py
from marshmallow import fields, validate, validates, ValidationError, EXCLUDE
from marshmallow_sqlalchemy import auto_field
from .base_schemas import BaseSchema, BaseSQLAlchemySchema, PaginacionSchema
from ..models.usuario import Usuario
from .validators import validate_email, validate_password


class UsuarioSchema(BaseSQLAlchemySchema):
    """
    Esquema para la serialización/deserialización de objetos Usuario.
    """

    class Meta:
        model = Usuario
        load_instance = True
        include_fk = True
        unknown = EXCLUDE

    id = auto_field(dump_only=True)
    nombre_completo = auto_field(
        required=True,
        validate=[
            validate.Length(
                min=3, max=255, error="El nombre debe tener entre 3 y 255 caracteres"
            ),
            validate.Regexp(
                r"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$",
                error="El nombre solo puede contener letras y espacios",
            ),
        ],
    )

    correo_electronico = auto_field(
        required=True,
        validate=[
            validate.Email(error="Formato de correo electrónico inválido"),
            validate.Length(
                max=255, error="El correo no puede exceder los 255 caracteres"
            ),
        ],
    )

    # Campo para la contraseña (solo para carga, no se incluye en la serialización)
    password = fields.Str(
        load_only=True,
        required=True,
        validate=[
            validate.Length(
                min=8, error="La contraseña debe tener al menos 8 caracteres"
            )
        ],
    )

    # Campo para el hash de la contraseña (solo para la base de datos)
    hashed_password = fields.Str(load_only=True, dump_only=True)

    rol = auto_field(
        validate=validate.OneOf(
            ["alumno", "docente", "admin"],
            error="Rol inválido. Debe ser 'alumno', 'docente' o 'admin'",
        )
    )

    activo = auto_field(dump_only=True)
    fecha_creacion = auto_field(dump_only=True)
    fecha_actualizacion = auto_field(dump_only=True)

    # Relaciones (solo para serialización)
    clases_impartidas = fields.Nested(
        "ClaseSchema", many=True, exclude=("profesor",), dump_only=True
    )

    inscripciones = fields.Nested(
        "InscripcionClaseSchema", many=True, exclude=("estudiante",), dump_only=True
    )

    @validates("correo_electronico")
    def validate_email_format(self, value):
        """Valida el formato del correo electrónico."""
        validate_email(value)


class UsuarioLoginSchema(BaseSchema):
    """
    Esquema para la validación de credenciales de inicio de sesión.
    """

    correo_electronico = fields.Email(
        required=True,
        error_messages={
            "required": "El correo electrónico es obligatorio",
            "invalid": "Formato de correo electrónico inválido",
        },
    )

    password = fields.Str(
        required=True,
        load_only=True,
        error_messages={"required": "La contraseña es obligatoria"},
    )

    remember_me = fields.Bool(load_default=False)


class UsuarioRegistroSchema(UsuarioSchema):
    """
    Esquema para el registro de nuevos usuarios.
    """

    confirmar_password = fields.Str(
        required=True,
        load_only=True,
        error_messages={"required": "La confirmación de contraseña es obligatoria"},
    )

    class Meta(UsuarioSchema.Meta):
        exclude = (
            "activo",
            "fecha_creacion",
            "fecha_actualizacion",
            "clases_impartidas",
            "inscripciones",
        )

    @validates("password")
    def validate_password_strength(self, value):
        """Valida la fortaleza de la contraseña."""
        validate_password(value)

    @validates("confirmar_password")
    def validate_password_match(self, value, **kwargs):
        """Valida que las contraseñas coincidan."""
        if "password" in self.context and value != self.context["password"]:
            raise ValidationError("Las contraseñas no coinciden")


class CambioPasswordSchema(BaseSchema):
    """
    Esquema para el cambio de contraseña de un usuario.
    """

    password_actual = fields.Str(
        required=True,
        load_only=True,
        error_messages={"required": "La contraseña actual es obligatoria"},
    )

    nueva_password = fields.Str(
        required=True,
        load_only=True,
        error_messages={"required": "La nueva contraseña es obligatoria"},
    )

    confirmar_nueva_password = fields.Str(
        required=True,
        load_only=True,
        error_messages={
            "required": "La confirmación de la nueva contraseña es obligatoria"
        },
    )

    @validates("nueva_password")
    def validate_new_password_strength(self, value):
        """Valida la fortaleza de la nueva contraseña."""
        validate_password(value)

    @validates("confirmar_nueva_password")
    def validate_new_password_match(self, value, **kwargs):
        """Valida que las nuevas contraseñas coincidan."""
        if "nueva_password" in self.context and value != self.context["nueva_password"]:
            raise ValidationError("Las contraseñas no coinciden")


class UsuarioActualizacionSchema(UsuarioSchema):
    """
    Esquema para la actualización de datos de usuario.
    """

    class Meta(UsuarioSchema.Meta):
        exclude = (
            "password",
            "fecha_creacion",
            "fecha_actualizacion",
            "clases_impartidas",
            "inscripciones",
        )
        load_instance = False

    # Hacer campos opcionales para actualización
    nombre_completo = fields.Str(
        required=False,
        validate=validate.Length(
            min=3, max=255, error="El nombre debe tener entre 3 y 255 caracteres"
        ),
    )

    correo_electronico = fields.Email(
        required=False,
        validate=validate.Length(
            max=255, error="El correo no puede exceder los 255 caracteres"
        ),
    )

    rol = fields.Str(
        required=False,
        validate=validate.OneOf(
            ["alumno", "docente", "admin"],
            error="Rol inválido. Debe ser 'alumno', 'docente' o 'admin'",
        ),
    )

    activo = fields.Bool(required=False)


class UsuarioPaginacionSchema(PaginacionSchema):
    """
    Esquema para la paginación de usuarios.
    """

    items = fields.Nested(UsuarioSchema, many=True, dump_only=True)

    def validate_not_empty(self, data, **kwargs):
        if not data:
            raise ValidationError("No se proporcionaron datos para actualizar")

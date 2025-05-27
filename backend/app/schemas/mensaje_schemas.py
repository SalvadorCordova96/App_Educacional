from marshmallow import fields, validate, EXCLUDE # Added EXCLUDE
from app.extensions import ma
from .base_schemas import BaseSQLAlchemySchema
from ..models.mensaje import Mensaje # Added import for Mensaje model

class MensajeSchema(BaseSQLAlchemySchema):
    class Meta:
        model = Mensaje # Changed from string to class
        load_instance = True
        unknown = EXCLUDE # Changed from ma.EXCLUDE to EXCLUDE

    id = fields.Int(dump_only=True)
    contenido = fields.Str(
        required=True,
        validate=validate.Length(min=1, max=1000, error="El mensaje debe tener entre 1 y 1000 caracteres")
    )
    fecha_creacion = fields.DateTime(dump_only=True)
    usuario_id = fields.Int(required=True)
    clase_id = fields.Int(required=True)

    # Relaciones seguras (evitan recursividad)
    usuario = fields.Nested("UsuarioSchema", only=("id", "nombre_completo"), dump_only=True)
    clase = fields.Nested("ClaseSchema", only=("id", "nombre"), dump_only=True)

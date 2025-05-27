from marshmallow import fields, validate
from app.extensions import ma
from .base_schemas import BaseSQLAlchemySchema

class MensajeSchema(BaseSQLAlchemySchema):
    class Meta:
        model = "Mensaje"
        load_instance = True
        unknown = ma.EXCLUDE

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

# app/models/inscripcion_clase.py
from typing import TYPE_CHECKING
from app.extensions import db  # Usar la instancia centralizada de `db`

# Importaciones de tipos para type checking
if TYPE_CHECKING:
    from .usuario import Usuario
    from .clase import Clase


class InscripcionClase(db.Model):
    __tablename__ = "inscripciones_clase"

    id = db.Column(db.Integer, primary_key=True)

    estudiante_id = db.Column(
        db.Integer,
        db.ForeignKey("usuarios.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)

    clase_id = db.Column(
        db.Integer,
        db.ForeignKey("clases.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    estudiante = db.relationship(
        "Usuario",
        foreign_keys=[estudiante_id],
        back_populates="inscripciones"
    )

    propietario_registro = db.relationship("Usuario", foreign_keys=[usuario_id])

    clase = db.relationship(
        "Clase",
        foreign_keys=[clase_id],
        back_populates="inscripciones"
    )

    def __repr__(self):
        return f'<InscripcionClase {self.id}>'

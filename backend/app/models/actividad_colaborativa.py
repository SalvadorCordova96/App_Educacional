from app.extensions import db
from datetime import datetime


class ActividadColaborativa(db.Model):
    __tablename__ = "actividades_colaborativas"

    id = db.Column(db.Integer, primary_key=True)
    modulo_id = db.Column(db.Integer, db.ForeignKey("modulos.id"))
    tipo = db.Column(db.String(50), nullable=False)
    datos = db.Column(db.JSON)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Actividad {self.tipo} (Módulo: {self.modulo_id})>"

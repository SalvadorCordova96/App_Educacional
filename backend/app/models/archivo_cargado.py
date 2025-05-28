# app/models/archivo_cargado.py
# BACKEND-REVIEW: 2025-05-20 - MODEL-UPLOAD-01 - Modelo para archivos subidos por docentes
# Creado para gestionar metadatos y estado de procesamiento de archivos (PDF, TXT) subidos.

from datetime import datetime
from app.extensions import db

class ArchivoCargado(db.Model):
    __tablename__ = 'archivos_cargados'

    id = db.Column(db.Integer, primary_key=True)
    nombre_original = db.Column(db.String(255), nullable=False)
    nombre_servidor = db.Column(db.String(255), nullable=False, unique=True)
    tipo_mime = db.Column(db.String(50), nullable=False)
    tamano = db.Column(db.Integer, nullable=False)
    ruta_almacenamiento = db.Column(db.String(512), nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)
    clase_id = db.Column(db.Integer, db.ForeignKey('clases.id'), nullable=False) # Changed to nullable=False
    fecha_subida = db.Column(db.DateTime, default=datetime.utcnow)
    estado_procesamiento_texto = db.Column(db.String(20), default='pendiente')  # pendiente, procesado, error
    texto_extraido = db.Column(db.Text, nullable=True)
    fecha_procesamiento = db.Column(db.DateTime, nullable=True)
    mensaje_error = db.Column(db.Text, nullable=True)

    # Relación inversa
    usuario = db.relationship('Usuario', backref='archivos_subidos', lazy=True)
    clase = db.relationship('Clase', back_populates='archivos')

    def __repr__(self):
        return f'<ArchivoCargado {self.id} - {self.nombre_original}>'

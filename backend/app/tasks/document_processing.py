# app/tasks/document_processing.py
# BACKEND-REVIEW: 2025-05-20 - FEATURE-UPLOAD-02 - Tarea Celery para extracción de texto
# Procesa archivos PDF/TXT de forma asíncrona usando PyMuPDF.

import fitz  # PyMuPDF
from celery import shared_task
from app.models import db, ArchivoCargado
from datetime import datetime

@shared_task
def extraer_texto_archivo(archivo_id):
    archivo = ArchivoCargado.query.get(archivo_id)
    if not archivo:
        return
    try:
        texto = ""
        if archivo.tipo_mime == "application/pdf":
            with fitz.open(archivo.ruta_almacenamiento) as doc:
                for page in doc:
                    texto += page.get_text()
        elif archivo.tipo_mime == "text/plain":
            with open(archivo.ruta_almacenamiento, "r", encoding="utf-8") as f:
                texto = f.read()
        archivo.texto_extraido = texto
        archivo.estado_procesamiento_texto = "procesado"
        archivo.fecha_procesamiento = datetime.utcnow()
        archivo.mensaje_error = None
    except Exception as e:
        archivo.estado_procesamiento_texto = "error"
        archivo.mensaje_error = str(e)
        archivo.fecha_procesamiento = datetime.utcnow()
    db.session.commit()

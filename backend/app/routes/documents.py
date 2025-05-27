# app/routes/documents.py
# BACKEND-REVIEW: 2025-05-20 - FEATURE-UPLOAD-01 - Endpoint para subida de documentos
# Permite a los docentes subir archivos PDF/TXT, valida y delega el procesamiento a Celery.

import os
import uuid
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from app.models import db, ArchivoCargado, Clase
from app.schemas import ArchivoCargadoSchema
from app.tasks.document_processing import extraer_texto_archivo

ALLOWED_MIME_TYPES = {"application/pdf", "text/plain"}
MAX_UPLOAD_SIZE = int(os.getenv("MAX_UPLOAD_SIZE", 10 * 1024 * 1024))  # 10MB por defecto
UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "uploads/")

documents_bp = Blueprint("documents", __name__, url_prefix="/api/v1/documents")

@documents_bp.route("/upload", methods=["POST"])
@jwt_required()
def upload_document():
    user_id = get_jwt_identity()
    file = request.files.get("file")
    clase_id = request.form.get("clase_id")

    if not file:
        return jsonify({"error": "No se envió ningún archivo."}), 400

    # Validar tipo MIME
    if file.mimetype not in ALLOWED_MIME_TYPES:
        return jsonify({"error": "Tipo de archivo no permitido."}), 400

    # Validar tamaño
    file.seek(0, os.SEEK_END)
    size = file.tell()
    file.seek(0)
    if size > MAX_UPLOAD_SIZE:
        return jsonify({"error": "El archivo excede el tamaño máximo permitido."}), 400

    # Sanitizar nombre
    original_filename = secure_filename(file.filename)
    unique_id = str(uuid.uuid4())
    server_filename = f"{unique_id}_{original_filename}"
    save_path = os.path.join(UPLOAD_FOLDER, server_filename)
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    file.save(save_path)

    # Crear registro en la base de datos
    archivo = ArchivoCargado(
        nombre_original=original_filename,
        nombre_servidor=server_filename,
        tipo_mime=file.mimetype,
        tamano=size,
        ruta_almacenamiento=save_path,
        usuario_id=user_id,
        clase_id=clase_id if clase_id else None,
        estado_procesamiento_texto="pendiente"
    )
    db.session.add(archivo)
    db.session.commit()

    # Lanzar tarea asíncrona
    extraer_texto_archivo.delay(archivo.id)

    return ArchivoCargadoSchema().jsonify(archivo), 201

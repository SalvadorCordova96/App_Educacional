# backend/app/courses/routes.py
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError

import os
from werkzeug.utils import secure_filename
from flask import current_app
from . import courses_bp # Blueprint from app/courses/__init__.py
from app.models.clase import Clase
from app.models.usuario import Usuario
from app.models.archivo_cargado import ArchivoCargado # Added
from app.schemas.clase_schemas import ClaseSchema, ClaseCreateSchema, ClaseUpdateSchema
from app.schemas.archivo_cargado_schemas import ArchivoCargadoSchema # Added
from app.extensions import db

# Initialize Marshmallow schemas
clase_schema = ClaseSchema()
clases_schema = ClaseSchema(many=True)
clase_create_schema = ClaseCreateSchema()
clase_update_schema = ClaseUpdateSchema()
archivo_cargado_schema = ArchivoCargadoSchema() # Added

# Allowed extensions for file uploads
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@courses_bp.route("/", methods=["POST"]) # Maps to /api/courses/ if courses_bp is registered with /courses
@jwt_required()
def create_clase():
    current_user_id = get_jwt_identity()
    current_user = Usuario.query.get(current_user_id)

    if not current_user or current_user.rol != 'docente':
        return jsonify({"error": "Acceso no autorizado. Se requiere rol de docente."}), 403

    json_data = request.get_json()
    if not json_data:
        return jsonify({"error": "Solicitud inválida. No se proporcionaron datos."}), 400

    try:
        data = clase_create_schema.load(json_data)
    except ValidationError as err:
        return jsonify({"error": "Error de validación.", "messages": err.messages}), 400

    # Generar código de inscripción único
    codigo_inscripcion_generado = Clase.generar_codigo_inscripcion()

    nueva_clase = Clase(
        nombre=data['nombre'],
        descripcion=data.get('descripcion'),
        imagen_url=data.get('imagen_url'),
        docente_id=current_user_id,
        codigo_inscripcion=codigo_inscripcion_generado
    )

    try:
        db.session.add(nueva_clase)
        db.session.commit()
        return jsonify(clase_schema.dump(nueva_clase)), 201
    except Exception as e:
        db.session.rollback()
        # Consider logging the error e
        return jsonify({"error": "Error interno del servidor al crear la clase."}), 500


@courses_bp.route("/", methods=["GET"])
@jwt_required()
def get_clases():
    current_user_id = get_jwt_identity()
    current_user = Usuario.query.get(current_user_id)

    if not current_user:
        return jsonify({"error": "Usuario no encontrado."}), 404

    if current_user.rol == 'docente':
        clases = Clase.query.filter_by(docente_id=current_user_id).all()
    elif current_user.rol == 'alumno':
        # Simplificación: Alumnos ven todas las clases. En una app real, sería clases inscritas.
        clases = Clase.query.filter_by(activa=True).all() # Solo clases activas para alumnos
    else: # admin u otros roles
        clases = Clase.query.all()
        
    return jsonify(clases_schema.dump(clases)), 200


@courses_bp.route("/<int:clase_id>", methods=["GET"])
@jwt_required()
def get_clase_by_id(clase_id):
    clase = Clase.query.get_or_404(clase_id)
    # Opcional: Lógica de permisos (ej. si el alumno está inscrito o es el docente)
    # current_user_id = get_jwt_identity()
    # current_user = Usuario.query.get(current_user_id)
    # if current_user.rol == 'alumno' and not clase.activa: # y no está inscrito
    #     return jsonify({"error": "Clase no disponible o acceso no autorizado."}), 403
    return jsonify(clase_schema.dump(clase)), 200


@courses_bp.route("/<int:clase_id>", methods=["PUT"])
@jwt_required()
def update_clase(clase_id):
    current_user_id = get_jwt_identity()
    clase = Clase.query.get_or_404(clase_id)

    if clase.docente_id != current_user_id:
        return jsonify({"error": "Acceso no autorizado. Solo el docente de la clase puede modificarla."}), 403

    json_data = request.get_json()
    if not json_data:
        return jsonify({"error": "Solicitud inválida. No se proporcionaron datos."}), 400

    try:
        data = clase_update_schema.load(json_data, partial=True) # partial=True para permitir actualizaciones parciales
    except ValidationError as err:
        return jsonify({"error": "Error de validación.", "messages": err.messages}), 400

    # Actualizar campos permitidos
    if 'nombre' in data:
        clase.nombre = data['nombre']
    if 'descripcion' in data:
        clase.descripcion = data['descripcion']
    if 'imagen_url' in data:
        clase.imagen_url = data['imagen_url']
    if 'activa' in data: # Permitir al docente activar/desactivar su clase
        clase.activa = data['activa']
    # codigo_inscripcion no se actualiza aquí, podría tener su propia lógica/endpoint si se permite regenerar

    try:
        db.session.commit()
        return jsonify(clase_schema.dump(clase)), 200
    except Exception as e:
        db.session.rollback()
        # Consider logging the error e
        return jsonify({"error": "Error interno del servidor al actualizar la clase."}), 500


@courses_bp.route("/<int:clase_id>", methods=["DELETE"])
@jwt_required()
def delete_clase(clase_id):
    current_user_id = get_jwt_identity()
    clase = Clase.query.get_or_404(clase_id)

    if clase.docente_id != current_user_id:
        # Opcional: Permitir a administradores eliminar
        # current_user = Usuario.query.get(current_user_id)
        # if not current_user or current_user.rol != 'admin':
        return jsonify({"error": "Acceso no autorizado. Solo el docente de la clase puede eliminarla."}), 403

    try:
        # Considerar manejo de dependencias (inscripciones, módulos, etc.)
        # Por ahora, borrado directo. En producción, podría ser un soft delete o manejo más complejo.
        db.session.delete(clase)
        db.session.commit()
        return jsonify({"mensaje": "Clase eliminada exitosamente."}), 200 # o 204 No Content
    except Exception as e:
        db.session.rollback()
        # Consider logging the error e
        return jsonify({"error": "Error interno del servidor al eliminar la clase."}), 500


@courses_bp.route("/<int:clase_id>/archivos", methods=["POST"])
@jwt_required()
def upload_archivo_clase(clase_id):
    current_user_id = get_jwt_identity()
    clase = Clase.query.get_or_404(clase_id)

    if clase.docente_id != current_user_id:
        return jsonify({"error": "Acceso no autorizado. Solo el docente de la clase puede subir archivos."}), 403

    if 'file' not in request.files:
        return jsonify({"error": "No se encontró el archivo en la solicitud."}), 400
    
    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No se seleccionó ningún archivo."}), 400

    if file and allowed_file(file.filename):
        original_filename = secure_filename(file.filename)
        # Consider generating a unique name for nombre_servidor to avoid collisions, e.g., using uuid
        # For simplicity, using original_filename for nombre_servidor for now, but this is not robust.
        # A better approach for nombre_servidor:
        # import uuid
        # unique_suffix = uuid.uuid4().hex
        # filename_parts = original_filename.rsplit('.', 1)
        # nombre_servidor_seguro = f"{filename_parts[0]}_{unique_suffix}.{filename_parts[1]}" if len(filename_parts) > 1 else f"{original_filename}_{unique_suffix}"
        # For this task, we'll use the original secure filename as nombre_servidor for simplicity, assuming UPLOAD_FOLDER structure handles some isolation.
        
        # Ensure UPLOAD_FOLDER is configured
        upload_folder_base = current_app.config.get('UPLOAD_FOLDER')
        if not upload_folder_base:
            return jsonify({"error": "La configuración de UPLOAD_FOLDER no está definida en el servidor."}), 500

        clase_upload_folder = os.path.join(upload_folder_base, str(clase.id))
        
        try:
            os.makedirs(clase_upload_folder, exist_ok=True)
        except OSError as e:
            # Log e
            return jsonify({"error": "No se pudo crear el directorio para la subida de archivos."}), 500

        save_path = os.path.join(clase_upload_folder, original_filename) # Using original for simplicity, consider unique names in prod
        
        try:
            file.save(save_path)
            file_size = os.path.getsize(save_path)
        except Exception as e:
            # Log e
            return jsonify({"error": f"No se pudo guardar el archivo: {str(e)}"}), 500

        nuevo_archivo = ArchivoCargado(
            nombre_original=original_filename,
            nombre_servidor=original_filename, # Using original_filename as nombre_servidor for this example
            tipo_mime=file.mimetype,
            tamano=file_size,
            ruta_almacenamiento=save_path, # This path should be relative to a known base or absolute if configured
            clase_id=clase.id,
            usuario_id=current_user_id
        )

        try:
            db.session.add(nuevo_archivo)
            db.session.commit()
            return jsonify(archivo_cargado_schema.dump(nuevo_archivo)), 201
        except Exception as e:
            db.session.rollback()
            # Log e
            # Potentially delete the saved file if DB commit fails
            if os.path.exists(save_path):
                 os.remove(save_path)
            return jsonify({"error": "Error interno del servidor al guardar la información del archivo."}), 500
    else:
        return jsonify({"error": "Tipo de archivo no permitido."}), 400

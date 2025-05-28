from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import ia_bp
# from app.services.anthropic_service import get_anthropic_response # Descomentar para Claude real

@ia_bp.route('/chat', methods=['POST'])
@jwt_required()
def handle_chat():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "Solicitud JSON inválida o vacía."}), 400
        
    user_message = data.get('message')

    if not user_message:
        return jsonify({"error": "No se proporcionó ningún mensaje ('message' field missing or empty)."}), 400

    # Opción 1: Respuesta Simulada (para esta iteración inicial)
    # Simulación de diferentes tipos de respuesta basados en el mensaje del usuario
    if "hola" in user_message.lower():
        ai_response_text = f"¡Hola, Usuario {current_user_id}! ¿Cómo puedo ayudarte hoy con tus estudios?"
    elif "inscripciones" in user_message.lower():
        ai_response_text = "Las inscripciones para el próximo semestre estarán abiertas del 1 al 15 de Julio. Puedes encontrar más información en la sección de Admisiones."
    elif "horarios" in user_message.lower():
        ai_response_text = "Los horarios de los cursos se publicarán en el portal del estudiante una semana antes del inicio de clases."
    elif "ayuda" in user_message.lower():
        ai_response_text = f"Estoy aquí para ayudarte, Usuario {current_user_id}. Por favor, especifica tu consulta."
    else:
        ai_response_text = f"He recibido tu mensaje: '{user_message}'. Como IA educativa, estoy aquí para asistirte. (Usuario: {current_user_id})"

    # Opción 2: Llamada básica a Claude (si anthropic_service está listo y configurado)
    # try:
    #     ai_response_text = get_anthropic_response(user_message)
    # except Exception as e:
    #     # Loggear el error e (e.g., current_app.logger.error(f"Anthropic API error: {e}"))
    #     return jsonify({"error": "Error al contactar el servicio de IA."}), 500

    return jsonify({
        "reply": ai_response_text,
        "user_id": current_user_id, # Opcional, para depuración o referencia
        "timestamp": datetime.utcnow().isoformat() + "Z" # Añadir timestamp para la respuesta
    }), 200

# Importación de datetime para el timestamp
from datetime import datetime

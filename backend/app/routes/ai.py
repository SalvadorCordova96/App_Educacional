from flask import Blueprint, jsonify, request
from app.services.anthropic_service import generate_text_completion, AnthropicServiceError, AnthropicRateLimitExceededError

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/generate', methods=['POST'])
def generate_text():
    prompt = request.json.get('prompt')
    if not prompt:
        return jsonify({"error": "El prompt es requerido"}), 400
    try:
        formatted_prompt = f"Human: {prompt}\n\nAssistant:"
        response_text = generate_text_completion(prompt_text=formatted_prompt)
        return jsonify({'response': response_text})
    except AnthropicRateLimitExceededError as e:
        return jsonify({'error': str(e)}), 429
    except AnthropicServiceError as e:
        return jsonify({'error': str(e)}), 503
    except Exception as e:
        return jsonify({'error': "Error interno del servidor al procesar la solicitud de IA."}), 500

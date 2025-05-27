# backend/app/services/anthropic_service.py
# BACKEND-REVIEW: 2025-05-22 - SERVICE-CLAUDE-INTEGRATION-01
# Razón: Encapsular la lógica de interacción con la API de Anthropic, manejo de errores, reintentos y timeouts.
import os
from anthropic import Anthropic, APIError, RateLimitError, OverloadedError
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

RETRY_MAX_ATTEMPTS = 3
RETRY_WAIT_MULTIPLIER = 1
RETRY_WAIT_MAX_SECONDS = 10
ANTHROPIC_TIMEOUT_SECONDS = 30.0

class AnthropicServiceError(Exception):
    pass

class AnthropicRateLimitExceededError(AnthropicServiceError):
    pass

@retry(
    stop=stop_after_attempt(RETRY_MAX_ATTEMPTS),
    wait=wait_exponential(multiplier=RETRY_WAIT_MULTIPLIER, max=RETRY_WAIT_MAX_SECONDS),
    retry=retry_if_exception_type((OverloadedError, APIError))
)
def generate_text_completion(prompt_text: str, model_name: str = "claude-2.1", max_tokens_to_sample: int = 1000) -> str:
    try:
        completion = anthropic_client.completions.create(
            model=model_name,
            max_tokens_to_sample=max_tokens_to_sample,
            prompt=prompt_text,
        )
        return completion.completion
    except RateLimitError as e:
        raise AnthropicRateLimitExceededError(f"Se ha excedido el límite de solicitudes a la API de IA. Detalle: {e}")
    except APIError as e:
        raise AnthropicServiceError(f"Hubo un problema al comunicarse con el servicio de IA. Detalle: {e}")
    except Exception as e:
        raise AnthropicServiceError(f"Ocurrió un error inesperado al procesar tu solicitud con la IA. Detalle: {e}")

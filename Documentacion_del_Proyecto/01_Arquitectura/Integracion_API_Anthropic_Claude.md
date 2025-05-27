# Integración con API de Anthropic Claude

A partir del 2025-05-22, la integración con la API de Anthropic Claude se realiza a través de un servicio dedicado (`app/services/anthropic_service.py`).

## Características del servicio
- Manejo de errores específicos del SDK de Anthropic (APIError, RateLimitError, OverloadedError).
- Estrategia de reintentos con backoff exponencial usando tenacity.
- Configuración de timeouts explícitos para las llamadas a la API.
- Excepciones personalizadas para traducir errores a respuestas HTTP claras.

## Uso en rutas
- Las rutas del backend deben importar y usar el servicio para interactuar con Claude.
- El servicio centraliza la lógica de integración y el manejo de errores.

## Ejemplo de uso
```python
from app.services.anthropic_service import generate_text_completion
response = generate_text_completion(prompt_text="Human: Hola\n\nAssistant:")
```

## Beneficios
- Mayor robustez y resiliencia ante fallos de la API externa.
- Mejor capacidad de diagnóstico y logging.
- Facilita la futura implementación de rate limiting y monitoreo de costos.

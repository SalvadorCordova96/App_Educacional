# Endpoints de IA Actualizados

## /generate (POST)

- Descripción: Genera texto usando la API de Anthropic Claude.
- Request: `{ "prompt": "texto del usuario" }`
- Respuestas posibles:
    - 200: `{ "response": "texto generado" }`
    - 400: `{ "error": "El prompt es requerido" }`
    - 429: `{ "error": "Se ha excedido el límite de solicitudes a la API de IA..." }`
    - 503: `{ "error": "Hubo un problema al comunicarse con el servicio de IA..." }`
    - 500: `{ "error": "Error interno del servidor al procesar la solicitud de IA." }`

- Notas:
    - El endpoint ahora utiliza un servicio dedicado para la integración con Claude.
    - El manejo de errores es más robusto y los códigos de error son más claros.

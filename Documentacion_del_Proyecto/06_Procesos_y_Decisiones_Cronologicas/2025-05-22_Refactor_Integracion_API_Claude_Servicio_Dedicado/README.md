# 2025-05-22 Refactorización de Integración con API de Anthropic Claude a Servicio Dedicado

**Fecha y Hora:** 2025-05-22 00:50
**Responsable(s):** Asistente IA

**Descripción del Proceso/Cambio:**
Se refactorizó la integración con la API de Anthropic Claude. Se creó un servicio dedicado (`app/services/anthropic_service.py`) que ahora encapsula todas las llamadas a la API de Claude. Este servicio implementa:
- Manejo de errores específicos de la API de Claude (ej. `RateLimitError`, `APIError`), traduciéndolos a excepciones personalizadas de la aplicación.
- Una estrategia de reintentos con backoff exponencial utilizando la librería `tenacity` para errores considerados transitorios.
- Se ha previsto la configuración de timeouts explícitos para las llamadas a la API (a ser implementado según las capacidades del SDK de Anthropic o mediante la librería de HTTP subyacente si es necesario).
Los endpoints de la API en `app/routes/ai.py` han sido actualizados para utilizar este nuevo servicio, mejorando la claridad y el manejo de errores a nivel de ruta.

**Justificación:**
Mejorar significativamente la robustez, resiliencia y mantenibilidad de la interacción con la API de IA externa. Esta centralización permite un manejo de errores más sofisticado y uniforme, y facilita futuras adaptaciones o cambios en la integración con Claude, alineado con el PDE (Sección 4 y 6) y el `Plan de Acción_ Mejoras.md` (Punto 3).

**Impacto:**
- Creación del nuevo archivo `app/services/anthropic_service.py`.
- Modificación de `app/routes/ai.py` para usar el servicio en lugar de llamadas directas al SDK.
- La aplicación ahora es más resistente a fallos temporales de la API de Claude.
- Mejor capacidad de diagnóstico de problemas relacionados con la IA gracias a un logging y manejo de errores más estructurado en el servicio.
- Posibilidad de introducir nuevos códigos de error HTTP (ej. 429, 503) en las respuestas de la API del backend.

**Dependencias:**
- `anthropic` (SDK, ya existente)
- `tenacity` (ya existente en `requirements.txt`)

**Instrucciones Adicionales:**
- Revisar y ajustar la lista de excepciones reintentables en la configuración de `tenacity` dentro de `anthropic_service.py` basándose en la documentación y comportamiento observado del SDK de Anthropic.
- Configurar los timeouts de manera apropiada para balancear la capacidad de respuesta y la tolerancia a la latencia de la API externa.
- Monitorear los logs generados por el servicio para identificar patrones de error o necesidad de ajustes en la estrategia de reintentos/timeouts.
- Considerar la implementación de rate limiting a nivel de endpoint (con Flask-Limiter) si el uso de la API de Claude se vuelve intensivo.

**Advertencias/Precauciones (si aplica):**
- Una configuración de reintentos demasiado agresiva o timeouts muy largos podría impactar negativamente la experiencia del usuario final.
- Es crucial asegurar que los prompts enviados al servicio sean correctamente formateados por la lógica de negocio que lo invoca, ya que el servicio se enfoca en la comunicación y manejo de errores, no en la semántica del prompt.

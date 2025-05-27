# Endpoints de Asistencia IA

## POST /api/evaluations/generate-questions

**Payload:**
```json
{
  "documento": "texto",
  "criterios": "rúbricas"
}
```

**Respuesta Exitosa:**
```json
{
  "preguntas": "lista generada por IA"
}
```

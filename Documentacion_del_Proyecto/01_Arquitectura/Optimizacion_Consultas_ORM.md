# Optimización de Consultas ORM y Estrategias para Evitar N+1 Queries

## Estrategias de Eager Loading

- Usar `joinedload()` para relaciones uno-a-muchos donde la colección no es muy grande.
- Usar `selectinload()` para relaciones muchos-a-muchos o uno-a-muchos grandes.
- Priorizar el uso de esquemas Marshmallow para serialización y asegurar que las relaciones necesarias estén cargadas previamente.

## Ejemplo de uso en rutas

```python
from sqlalchemy.orm import joinedload
usuarios = Usuario.query.options(joinedload(Usuario.clases_impartidas)).all()
```

## Consideraciones
- No aplicar eager loading indiscriminadamente.
- Analizar cada caso de uso y el tamaño de las relaciones.
- Usar herramientas de profiling para identificar cuellos de botella.

## Modelos afectados
- Usuario (inscripciones, clases_impartidas, respuestas)
- Modulo (lecciones)
- Clase (mensajes)
- Evaluacion (preguntas, respuestas)
- Pregunta (opciones, respuestas)

## Serialización
- Preferir Marshmallow sobre métodos to_dict() manuales.
- Si se usa to_dict(), asegurar que las relaciones estén cargadas previamente.

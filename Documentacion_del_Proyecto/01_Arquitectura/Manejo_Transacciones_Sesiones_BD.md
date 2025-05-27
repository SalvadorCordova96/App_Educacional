# Manejo de Transacciones y Sesiones de Base de Datos

## Práctica recomendada

- Realizar un único `db.session.commit()` al final de todas las operaciones de base de datos exitosas dentro de un mismo request handler.
- Usar `db.session.rollback()` en los bloques `except` para revertir todos los cambios si ocurre un error.

## Justificación

- Mejora la atomicidad y consistencia de las transacciones.
- Reduce el riesgo de estados de datos inconsistentes si una operación falla después de que otras ya han sido consolidadas.
- Alineado con el Plan de Desarrollo Estratégico (PDE) en cuanto a Calidad y Escalabilidad Técnica.

## Ejemplo de patrón recomendado

```python
try:
    db.session.add(objeto1)
    db.session.add(objeto2)
    # ... otras operaciones ...
    db.session.commit()  # Commit único al final
except Exception as e:
    db.session.rollback()
    # Manejo de error
```

## Advertencias

- No mantener transacciones abiertas innecesariamente por mucho tiempo.
- Siempre asegurar la presencia de `db.session.rollback()` en los manejadores de excepciones.

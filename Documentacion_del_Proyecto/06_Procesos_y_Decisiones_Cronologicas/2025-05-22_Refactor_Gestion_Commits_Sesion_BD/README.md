# 2025-05-22 Refactorización de Gestión de Commits en Sesiones de Base de Datos

**Fecha y Hora:** 2025-05-22 00:50
**Responsable(s):** Asistente IA

**Descripción del Proceso/Cambio:**
Se refactorizaron los manejadores de rutas (endpoints) en el backend que realizan operaciones de escritura a la base de datos. El cambio principal consiste en asegurar que se realice un único `db.session.commit()` al final de todas las operaciones de base de datos exitosas dentro de un mismo request, en lugar de múltiples commits intermedios. El `db.session.rollback()` se mantiene en los bloques `except` para revertir todos los cambios en caso de error.

**Justificación:**
Mejorar la atomicidad y consistencia de las transacciones de base de datos por request. Esta práctica reduce el riesgo de estados de datos inconsistentes si una operación falla después de que otras ya han sido consolidadas. Alineado con el PDE en cuanto a Calidad y Escalabilidad Técnica (Principio 7).

**Impacto:**
-   Modificación de la lógica de commit en archivos como `app/auth/routes.py` y `app/evaluations/routes.py`.
-   Mayor robustez en el manejo de transacciones de base de datos.
-   No se espera impacto negativo en el rendimiento para las operaciones actuales; podría mejorar ligeramente al reducir el número de commits por request.

**Dependencias:**
-   Ninguna nueva. Se basa en el uso correcto de SQLAlchemy.

**Instrucciones Adicionales:**
-   Al desarrollar nuevos endpoints o modificar existentes que interactúen con la base de datos, seguir el patrón de un único commit al final de las operaciones exitosas del bloque `try`.
-   Asegurar siempre la presencia de `db.session.rollback()` en los manejadores de excepciones que involucran operaciones de base de datos.

**Advertencias/Precauciones (si aplica):**
-   Para operaciones extremadamente largas que no sean de base de datos entre el primer `add` y el `commit` final, la transacción podría mantenerse abierta más tiempo. Sin embargo, esto no es un problema con la estructura actual de los endpoints.

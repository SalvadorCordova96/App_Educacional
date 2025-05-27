# 2025-05-22 Eliminación de `db.create_all()` para Gestión de Esquema con Alembic

**Fecha y Hora:** 2025-05-22 00:50
**Responsable(s):** Asistente IA

**Descripción del Proceso/Cambio:**
Se eliminó la llamada a `db.create_all()` de la función factory `create_app` en `app/__init__.py`. A partir de ahora, la creación y todas las modificaciones del esquema de la base de datos serán manejadas exclusivamente a través de las migraciones de Alembic.

**Justificación:**
Esta práctica es fundamental para asegurar la consistencia y el versionado del esquema de la base de datos, especialmente en entornos de staging y producción. Previene el "schema drift" y conflictos con el sistema de migraciones de Alembic, alineándose con el PDE en Calidad y Escalabilidad Técnica (Principio 7).

**Impacto:**
-   La inicialización de la aplicación ya no intentará crear tablas automáticamente.
-   Los desarrolladores y los scripts de despliegue deben usar `flask db upgrade` para aplicar el esquema de la base de datos.
-   Mayor fiabilidad en la gestión del esquema de la base de datos.

**Dependencias:**
-   Flask-Migrate y Alembic (ya configurados en el proyecto).

**Instrucciones Adicionales:**
-   Para configurar una nueva base de datos (desarrollo o pruebas), se debe ejecutar `flask db upgrade` después de la creación inicial de la base de datos.
-   Toda modificación al esquema de los modelos SQLAlchemy debe ir acompañada de una nueva migración generada con `flask db migrate -m "descripcion del cambio"` y luego aplicada con `flask db upgrade`.

**Advertencias/Precauciones (si aplica):**
-   Los entornos de desarrollo existentes que dependían de `db.create_all()` podrían necesitar una ejecución manual de `flask db upgrade` para asegurar que su esquema esté alineado con las migraciones.

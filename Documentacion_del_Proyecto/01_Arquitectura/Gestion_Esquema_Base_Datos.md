# Gestión del Esquema de Base de Datos con Alembic

A partir del 2025-05-22, la creación y actualización del esquema de la base de datos en todos los entornos (desarrollo, pruebas, producción) se gestiona exclusivamente mediante migraciones de Alembic (Flask-Migrate). La llamada a `db.create_all()` ha sido eliminada del código principal de la aplicación.

## Rol de Alembic
- Alembic es la única fuente de verdad para la evolución del esquema de la base de datos.
- Todas las modificaciones de modelos deben reflejarse en migraciones generadas y aplicadas con `flask db migrate` y `flask db upgrade`.

## Beneficios
- Consistencia y versionado del esquema.
- Evita discrepancias entre modelos y base de datos.
- Facilita el despliegue y la reversibilidad de cambios.

## Proceso recomendado
1. Modifica los modelos SQLAlchemy según sea necesario.
2. Genera una nueva migración: `flask db migrate -m "descripcion del cambio"`.
3. Aplica la migración: `flask db upgrade`.

## Notas para desarrollo y pruebas
- Para bases de datos de pruebas efímeras, se puede usar `db.create_all()` solo en el contexto de tests, nunca en el código principal de la app.

## Referencias
- [Documentación oficial de Alembic](https://alembic.sqlalchemy.org/)
- [Flask-Migrate](https://flask-migrate.readthedocs.io/)

---
**Última actualización:** 2025-05-22

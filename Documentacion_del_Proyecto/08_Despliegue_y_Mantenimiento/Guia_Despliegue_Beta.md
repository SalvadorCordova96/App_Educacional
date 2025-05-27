# Guía de Despliegue Beta - Aplicación Educativa

## Esquema de Base de Datos

- El esquema de la base de datos debe ser gestionado exclusivamente con Alembic (Flask-Migrate).
- Para aplicar el esquema o actualizarlo, ejecutar:

```sh
flask db upgrade
```

- No usar `db.create_all()` en producción ni en staging.
- Toda modificación de modelos debe ir acompañada de una migración.

## Requisitos previos
- Base de datos creada (vacía o existente)
- Variables de entorno configuradas
- Alembic y Flask-Migrate instalados

## Pasos para el despliegue
1. **Instalar dependencias:**
   ```bash
   pip install -r requirements.txt
   ```
2. **Configurar variables de entorno** según el entorno (ver sección correspondiente).
3. **Aplicar migraciones de base de datos:**
   ```bash
   flask db upgrade
   ```
4. **Iniciar la aplicación:**
   ```bash
   flask run
   ```

## Notas adicionales
- Para cambios en los modelos, generar una nueva migración con:
  ```bash
  flask db migrate -m "Descripción del cambio"
  flask db upgrade
  ```
- Consultar la documentación de Alembic para flujos avanzados.

---
**Última actualización:** 2025-05-22

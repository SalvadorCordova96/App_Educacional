# 2025-05-22 Optimización de Consultas ORM para Evitar Problemas N+1

**Fecha y Hora:** 2025-05-22 00:50
**Responsable(s):** Asistente IA

**Descripción del Proceso/Cambio:**
Se identificaron y refactorizaron consultas SQLAlchemy en varias rutas y métodos de serialización que eran susceptibles a problemas de N+1 queries debido al uso de relaciones `lazy="dynamic"` o acceso a colecciones lazy-loaded dentro de bucles. Se aplicaron estrategias de carga anticipada (eager loading) como `joinedload()` y `selectinload()` en los puntos críticos. Se priorizó el uso de esquemas Marshmallow para la serialización, asegurando que las relaciones necesarias se carguen previamente.

**Justificación:**
Mejorar drásticamente el rendimiento de la base de datos y la escalabilidad de la aplicación, previniendo la degradación del rendimiento a medida que aumenta el volumen de datos. Esto se alinea con el PDE en Calidad y Escalabilidad Técnica (Principio 7) y Rendimiento (Sección 6).

**Impacto:**
-   Modificación de consultas en rutas que listan entidades con sus relaciones (ej. usuarios con cursos, módulos con lecciones).
-   Optimización de métodos `to_dict()` o su reemplazo/adaptación para trabajar con esquemas Marshmallow y datos pre-cargados.
-   Reducción significativa del número de consultas SQL ejecutadas por request en los casos afectados.
-   Mejora en los tiempos de respuesta de la API.

**Dependencias:**
-   SQLAlchemy (uso de `joinedload`, `selectinload` desde `sqlalchemy.orm`).

**Instrucciones Adicionales:**
-   Al desarrollar nuevas rutas o funcionalidades que accedan a relaciones de modelos, analizar la necesidad de eager loading para evitar problemas N+1.
-   Utilizar herramientas de profiling de base de datos o el logging de queries de SQLAlchemy para monitorear el número de consultas y confirmar las optimizaciones.
-   Al usar esquemas Marshmallow para serializar, asegurarse de que las consultas que alimentan los esquemas carguen anticipadamente las relaciones que el esquema va a exponer.

**Advertencias/Precauciones (si aplica):**
-   El uso indiscriminado de eager loading para relaciones no siempre necesarias puede llevar a consultas más pesadas de lo requerido. Aplicar con discernimiento según el caso de uso.
-   `lazy="dynamic"` sigue siendo una opción válida para relaciones muy grandes donde solo se necesitan operaciones como conteos o subconjuntos paginados, siempre que no se itere sobre toda la colección sin eager loading.

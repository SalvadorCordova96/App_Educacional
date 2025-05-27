# Estado global básico para navegación

## Fecha: 2025-05-20

### ¿Qué se hizo?
Se mejoró el contexto de autenticación (`frontend/src/contexts/AuthContext.jsx`) para asegurar que el usuario y el token estén correctamente gestionados, permitiendo mostrar/ocultar secciones y navegación contextual según el rol y autenticación.

### ¿Por qué?
Para garantizar una experiencia de usuario coherente y segura, y facilitar la navegación contextual, alineado con el Plan de Desarrollo Estratégico.

### Impacto
- El usuario ve solo lo que le corresponde.
- Reducción de bugs de navegación y errores de visualización.

### Consideraciones
- El contexto de autenticación debe mantenerse sincronizado con el backend.
- Es importante validar los roles y permisos en ambos lados.

---
[// [MEJORA] Estado global básico para navegación]

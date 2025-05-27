# Soporte básico PWA: manifest.json y service worker

## Fecha: 2025-05-20

### ¿Qué se hizo?
- Se creó el archivo `frontend/public/manifest.json` con los datos mínimos para PWA (nombre, iconos, colores, etc.).
- Se verificó la existencia de un service worker básico (`frontend/dev-dist/sw.js`).
- Se corrigió la referencia al manifest y al service worker en `frontend/index.html`.

### ¿Por qué?
Para permitir la instalación de la app como PWA, visualización de icono y sentar las bases para funcionalidad offline, alineado con el Plan de Desarrollo Estratégico.

### Impacto
- La app puede instalarse en dispositivos móviles y de escritorio.
- Mejora la percepción de calidad y accesibilidad.

### Consideraciones
- Los iconos deben existir en `frontend/public/assets/`.
- El service worker puede mejorarse para soporte offline avanzado en el futuro.

---
[// [IMPLEMENTACION] manifest.json y service worker básico]

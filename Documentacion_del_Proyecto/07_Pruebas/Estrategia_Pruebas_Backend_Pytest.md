# Estrategia de Pruebas Backend

## Framework: Pytest
- **Versión:** 7.4.0
- **Plugins:** pytest-flask, pytest-cov

## Cobertura Inicial Objetivo:
- 80% para módulos críticos (auth, models)

## Tipos de Pruebas:
1. **Unitarias:** Modelos y lógica de negocio
2. **Integración:** Endpoints API

## Ejecución:
```bash
pytest backend/tests/
pytest --cov=app --cov-report=html
```

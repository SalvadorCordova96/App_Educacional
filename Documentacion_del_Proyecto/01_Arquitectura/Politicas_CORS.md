# Políticas CORS

## Configuración de Producción:
- **Orígenes Permitidos:** ${FRONTEND_URL}
- **Métodos:** GET, POST, PUT, DELETE, OPTIONS
- **Credentials:** Habilitados

## Desarrollo:
- **Orígenes:** ${CORS_ORIGINS} (default: '*')

## Requisitos:
- Variable FRONTEND_URL obligatoria en producción

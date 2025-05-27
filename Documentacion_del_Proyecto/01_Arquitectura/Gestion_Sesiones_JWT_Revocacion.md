# Gestión de Sesiones y Revocación de Tokens

## Componentes:
- **Redis:** Almacén de tokens revocados
- **JWT Blocklist:** Configuración en Flask

## Endpoints:
- POST `/auth/logout`

## Flujo de Revocación:
1. Usuario hace logout
2. JTI del token se almacena en Redis
3. Verificación en cada solicitud protegida

// frontend/test/test-setup.js

// Configuración de pruebas
import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Establecer el servidor de mocks antes de todas las pruebas
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Limpiar todos los mocks después de cada prueba
afterEach(() => server.resetHandlers());

// Cerrar el servidor después de todas las pruebas
afterAll(() => server.close());

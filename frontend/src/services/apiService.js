// apiService.js: Servicio centralizado para llamadas a APIs backend
// Prácticas: manejo de errores, token, integración flexible

// [MEJORA] Cambio de API_BASE a Flask backend (puerto 5000)
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

export async function apiGet(endpoint, token) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Error en la petición GET');
  return res.json();
}

export async function apiPost(endpoint, data, token) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error en la petición POST');
  return res.json();
}

// ...puedes agregar apiPut, apiDelete, etc. siguiendo el mismo patrón
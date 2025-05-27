// apiService.js: Servicio centralizado para llamadas a APIs backend
// Prácticas: manejo de errores, token, integración flexible

// [MEJORA] Cambio de API_BASE a Flask backend (puerto 5000)
const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').replace(/\/$/, ''); // Elimina slash final si existe

function joinEndpoint(base, endpoint) {
  // Asegura que solo haya un slash entre base y endpoint
  if (!endpoint.startsWith('/')) endpoint = '/' + endpoint;
  return base + endpoint;
}

export async function apiGet(endpoint, token) {
  const url = joinEndpoint(API_BASE, endpoint);
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Error en la petición GET');
  return res.json();
}

export async function apiPost(endpoint, data, token) {
  const url = joinEndpoint(API_BASE, endpoint);
  // Para depuración:
  console.log('POST a:', url, 'con datos:', data);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
  let errorMsg = 'Error en la petición POST';
  if (!res.ok) {
    try {
      const errJson = await res.json();
      errorMsg = errJson.error || errorMsg;
    } catch (e) {}
    throw new Error(errorMsg);
  }
  return res.json();
}

// ...puedes agregar apiPut, apiDelete, etc. siguiendo el mismo patrón
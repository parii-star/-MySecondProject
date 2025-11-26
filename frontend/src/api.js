const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://backend:5000/api';

async function handleResponse(response) {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const errorMessage = body.error || body.message || 'Request failed';
    throw new Error(errorMessage);
  }
  return response.json();
}

export async function fetchEntries() {
  const response = await fetch(`${API_BASE_URL}/entries`);
  return handleResponse(response);
}

export async function createEntry(content) {
  const response = await fetch(`${API_BASE_URL}/entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  return handleResponse(response);
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

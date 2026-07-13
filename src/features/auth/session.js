/** Client calls to `/auth/session` (HTTP-only cookie is set by the route handler). */

export async function persistAuthSession({ token, user, remember }) {
  const response = await fetch('/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, user, remember: Boolean(remember) }),
  });

  if (!response.ok) {
    throw new Error('Failed to persist auth session');
  }

  return response.json();
}

export async function clearAuthSession() {
  const response = await fetch('/auth/session', { method: 'DELETE' });
  if (!response.ok) {
    throw new Error('Failed to clear auth session');
  }
  return response.json();
}

export async function fetchAuthSession() {
  const response = await fetch('/auth/session', {
    method: 'GET',
    cache: 'no-store',
  });

  if (!response.ok) {
    return { authenticated: false, token: null, user: null };
  }

  return response.json();
}

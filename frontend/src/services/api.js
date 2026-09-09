const BASE_URL = import.meta.env.VITE_API_URL;

async function request(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export function getItems() {
  return request("/items");
}

export function getItemById(id) {
  return request(`/items/${id}`);
}

export function createItem(data) {
  return request("/items", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getUsers() {
  return request("/users");
}

// Mock sign-up: posts the new user to json-server's /users endpoint.
// This is a stand-in until the real backend has an actual auth/register endpoint.
//
// json-server v1 auto-generates a random string ID if we don't supply one
// ourselves — which produces ugly, non-sequential values like "4ahwvUiJHwE".
// To keep our mock data readable, we look up the current highest numeric id
// and submit the next one explicitly. This workaround is ONLY needed because
// we're using json-server as a placeholder; a real database assigns its own
// ids automatically and this logic should be deleted once that's in place.
export async function signUp(data) {
  const existingUsers = await getUsers();

  const highestId = existingUsers.reduce((max, user) => {
    const numericId = parseInt(user.id, 10);
    return Number.isNaN(numericId) ? max : Math.max(max, numericId);
  }, 0);

  const nextId = String(highestId + 1);

  return request("/users", {
    method: "POST",
    body: JSON.stringify({ ...data, id: nextId }),
  });
}

// Mock "current logged-in user" — since there's no real authentication yet,
// this hardcodes fetching user id "1" (David). Once real login/auth exists,
// this should instead read the logged-in user's actual id (e.g. from a token
// or auth context) rather than a hardcoded "1".
export function getCurrentUser() {
  return request("/users/1");
}

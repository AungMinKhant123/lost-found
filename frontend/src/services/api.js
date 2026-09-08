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
export function signUp(data) {
  return request("/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

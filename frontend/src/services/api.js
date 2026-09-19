import { useAuthStore } from "../store/authStore";

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

export function getUsers() {
  return request("/users");
}

export async function loginUser(email, password) {
  const users = await getUsers();

  const user = users.find(
    (user) =>
      user.email.toLowerCase() === email.trim().toLowerCase() &&
      user.password === password,
  );

  if (!user) {
    throw new Error("Invalid email or password");
  }

  return user;
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

// export function getUsers() {
//   return request("/users");
// }

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

// Fetches the CURRENTLY LOGGED IN user's full data from json-server.
//
// Reads the logged-in user's id from the shared Zustand auth store
// (the same store the Navbar, LogIn.jsx, and the mock switcher all use).
// Falls back to user "1" (David) if nobody's logged in — this keeps
// existing pages working exactly as before for anyone testing without
// bothering to log in first, while ALSO correctly personalizing once
// someone actually is logged in (real or mock).
export function getCurrentUser() {
  const { user } = useAuthStore.getState();
  const userId = user?.id || "1";
  return request(`/users/${userId}`);
}

export function updateUser(id, data) {
  return request(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// Fetches only the items belonging to a specific user — used for "My Posts".
//
// NOTE: originally this used json-server's query filtering
// (/items?userId=X), but that wasn't reliably matching in testing —
// a quirk in json-server's query behavior, not our data. Fetching
// everything and filtering here is simpler and avoids depending on
// that behavior. Fine at this data scale; a real backend would do
// this filtering server-side instead.
export async function getItemsByUser(userId) {
  const allItems = await getItems();
  return allItems.filter((item) => item.userId === userId);
}

// Fetches all claims belonging to a specific user — used for "My Claims".
// Same approach as getItemsByUser: fetch everything, filter client-side,
// since json-server's query filtering wasn't reliable in testing.
export async function getClaimsByUser(userId) {
  const allClaims = await request("/claims");
  return allClaims.filter((claim) => claim.userId === userId);
}

// Fetches a single claim by id — used for the Claim Details page.
// Unlike getClaimsByUser/getItemsByUser, this hits json-server's
// standard /claims/:id route directly (not a query filter), which
// works reliably — the filtering issue we hit earlier was specific
// to query-string filters, not direct id lookups.
export function getClaimById(id) {
  return request(`/claims/${id}`);
}

// Fetches items for the Home page's "Recently Reported Items" section.
// For now this just takes the first N from the full items list — once
// items have real createdAt timestamps, this should sort by that instead.
export async function getRecentItems(limit = 6) {
  const allItems = await getItems();
  return allItems.slice(0, limit);
}

// Fetches a single user by id — used to show a claimant's name/info.
export function getUserById(id) {
  return request(`/users/${id}`);
}

// Fetches all claims made on a specific item — used for "Claims Received".
// Same client-side-filter approach as getItemsByUser/getClaimsByUser,
// since json-server's query filtering wasn't reliable in testing.
export async function getClaimsForItem(itemId) {
  const allClaims = await request("/claims");
  return allClaims.filter((claim) => claim.itemId === itemId);
}

// Updates a claim's status (accepted/declined) — a real write to json-server,
// using PATCH to update just that one field rather than the whole record.
export function updateClaimStatus(claimId, status) {
  return request(`/claims/${claimId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

// Updates an item's fields (e.g. marking it resolved) — used when a claim
// is accepted, since accepting means the item search is over.
export function updateItemStatus(itemId, updates) {
  return request(`/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

// Fetches all claims — shared by getClaimsByUser, getClaimsForItem, and
// anywhere else that needs to filter the full claims list client-side.
export function getClaims() {
  return request("/claims");
}

// TEMPORARY, DEV-ONLY: lets you test the app as different mock users
// from json-server, without needing the real backend running. Call
// from the browser console, e.g. window.mockLoginAs('2').
//
// This does NOT touch the real login flow at all — it writes to the
// exact same auth store LogIn.jsx does, which is why the Navbar and
// every "current user" page reacts to it identically to a real login.
// Safe to delete this whole block once real backend integration is
// complete and no longer needed for local testing.
if (import.meta.env.DEV) {
  window.mockLoginAs = async (userId) => {
    const user = await getUserById(userId);
    useAuthStore.getState().login(user, "mock-token");
    console.log("Logged in as mock user:", user);
  };

  window.mockLogout = () => {
    useAuthStore.getState().logout();
    console.log("Logged out.");
  };
}

// TEMPORARY, DEV-ONLY: looks up a mock user in json-server by email +
// password, used ONLY as a fallback in LogIn.jsx when the real backend
// is unreachable (see the comment there for the exact condition). Real,
// successful backend responses never reach this function at all.
export async function getMockUserByCredentials(email, password) {
  const allUsers = await request("/users");
  return allUsers.find(
    (u) =>
      u.email?.toLowerCase() === email.toLowerCase() && u.password === password,
  );
}

// TEMPORARY, DEV-ONLY: creates a new user directly in json-server, used
// ONLY as a fallback in SignUp.jsx when the real backend is unreachable
// (same exact condition/reasoning as the login fallback above). Mirrors
// the id-numbering logic from our very first mock signUp() function.
export async function createMockUser(userData) {
  const existingUsers = await getUsers();

  const emailTaken = existingUsers.some(
    (u) => u.email?.toLowerCase() === userData.email.toLowerCase(),
  );
  if (emailTaken) {
    throw new Error("An account with this email already exists.");
  }

  const highestId = existingUsers.reduce((max, user) => {
    const numericId = parseInt(user.id, 10);
    return Number.isNaN(numericId) ? max : Math.max(max, numericId);
  }, 0);
  const nextId = String(highestId + 1);

  return request("/users", {
    method: "POST",
    body: JSON.stringify({ ...userData, id: nextId }),
  });
}

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

// Fetches all items, sorted NEWEST FIRST by createdAt.
//
// Sorting by id was unreliable, since json-server doesn't consistently
// respect a client-supplied id (it sometimes generates its own random
// string instead — see createItemWithSequentialId's comment). createdAt
// is a timestamp WE set ourselves at creation time, so it's always
// trustworthy regardless of what id ends up assigned.
//
// Older seed items in db.json don't have a createdAt field at all —
// those are treated as oldest (sorted to the bottom), which is fine
// since their exact relative order doesn't matter; what matters is that
// genuinely new items always float to the top.
export async function getItems() {
  const items = await request("/items");
  return [...items].sort((a, b) => {
    if (!a.createdAt && !b.createdAt) return 0;
    if (!a.createdAt) return 1;
    if (!b.createdAt) return -1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
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
// IMPORTANT: since the real backend now stores users with UUID-style
// ids (e.g. "46a56141-6d45-4456-8820..."), and our persisted auth store
// can hold either a real backend user OR one of our json-server mock
// users, we need to detect which kind we have. A UUID (containing
// dashes) means "real backend session" — that user won't exist in
// json-server at all, so we fall back to mock user "1" (David) instead
// of 404ing. This only affects json-server-only pages (My Posts, My
// Claims, this Item Details modal, etc.) — it does NOT touch or
// interfere with the real backend session itself, which lives
// separately in authApi.js/useAuth.js and is untouched by this file.
export function getCurrentUser() {
  const { user } = useAuthStore.getState();
  const isRealBackendId = user?.id && String(user.id).includes("-");
  const userId = !user?.id || isRealBackendId ? "1" : user.id;
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
    if (user.role === "admin") {
      console.log(
        "This user is an admin — navigate to /admin manually (console can't redirect the router).",
      );
    }
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

// Creates a new item. Also stamps a "createdAt" timestamp ourselves —
// NOT relying on json-server's id assignment, since it doesn't reliably
// respect a client-supplied id (same issue we saw with signUp()). This
// timestamp is what getItems() actually sorts by, so "newest first"
// stays correct regardless of what id json-server ends up assigning.
export async function createItemWithSequentialId(data) {
  const existingItems = await getItems();

  const highestId = existingItems.reduce((max, item) => {
    const numericId = parseInt(item.id, 10);
    return Number.isNaN(numericId) ? max : Math.max(max, numericId);
  }, 0);

  const nextId = String(highestId + 1);

  return createItem({
    ...data,
    id: nextId, // still attempted, harmless even if ignored
    createdAt: new Date().toISOString(),
  });
}

// Creates a new claim on an item — the actual "submit a claim" action,
// distinct from updateClaimStatus (which only changes an EXISTING
// claim's status). Follows the same sequential-id pattern as
// createItemWithSequentialId, since json-server doesn't reliably
// respect a client-supplied id.
export async function createClaim(data) {
  const existingClaims = await getClaims();

  const highestId = existingClaims.reduce((max, claim) => {
    const numericId = parseInt(claim.id, 10);
    return Number.isNaN(numericId) ? max : Math.max(max, numericId);
  }, 0);

  const nextId = String(highestId + 1);

  return request("/claims", {
    method: "POST",
    body: JSON.stringify({ ...data, id: nextId }),
  });
}

// Computes the admin dashboard's aggregate stats across ALL items/claims
// (not filtered to one user) — total claims made, resolved items, open
// (unresolved) items, and total items ever posted.
export async function getAdminStats() {
  const [items, claims] = await Promise.all([getItems(), getClaims()]);

  return {
    totalClaimsMade: claims.length,
    resolvedItems: items.filter((item) => item.resolved).length,
    openItems: items.filter((item) => !item.resolved).length,
    totalItemsPosted: items.length,
  };
}

// Computes how many items fall into each category, for the dashboard's
// "Items by category" bar list. Accepts an optional "period" filter
// (year/month/week/day) to restrict counting to items posted within
// that window — based on each item's createdAt timestamp.
export async function getItemsByCategory(period = "all") {
  const items = await getItems();

  const cutoff = (() => {
    const now = new Date();
    if (period === "year") return new Date(now.getFullYear(), 0, 1);
    if (period === "month")
      return new Date(now.getFullYear(), now.getMonth(), 1);
    if (period === "week") {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      return d;
    }
    if (period === "day") {
      const d = new Date(now);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    return null; // 'all' — no cutoff
  })();

  const filteredItems = cutoff
    ? items.filter(
        (item) => item.createdAt && new Date(item.createdAt) >= cutoff,
      )
    : items;

  // Initialize all base categories with 0 so they remain present
  const ALL_CATEGORIES = [
    "Clothing",
    "Electronics",
    "Accessories",
    "Other",
    "Bags",
    "Documents",
    "Others",
  ];

  const counts = ALL_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = 0;
    return acc;
  }, {});

  filteredItems.forEach((item) => {
    const category = item.category || "Others";
    // Increment if it exists in base categories, otherwise set or create it
    counts[category] = (counts[category] || 0) + 1;
  });

  return counts;
}

// Builds a simple "recent activity" feed from the most recent items and
// claims combined, sorted newest first. Each entry is normalized to the
// same shape (type, message, timestamp) so the dashboard can render
// them uniformly regardless of source.
//
// NOTE: this is a best-effort feed built from what our mock data
// actually tracks (item creation via createdAt, claim creation via
// claimedAt) — it doesn't capture every possible event type a real
// backend audit log might (e.g. "item marked resolved" isn't tracked
// with its own timestamp in our schema). Good enough to demonstrate
// the UI; a real backend would likely have a dedicated activity log.
export async function getRecentActivity(limit = 12) {
  const [items, claims, users] = await Promise.all([
    getItems(),
    getClaims(),
    getUsers(),
  ]);

  const findUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : "Someone";
  };

  const itemEvents = items
    .filter((item) => item.createdAt)
    .map((item) => ({
      type: item.status === "lost" ? "lost" : "found",
      message: `${findUserName(item.userId)} posted a ${item.status === "lost" ? "Lost" : "Found"} item`,
      timestamp: item.createdAt,
    }));

  const resolvedEvents = items
    .filter((item) => item.resolved)
    .map((item) => ({
      type: "resolved",
      message: `${item.title} was marked Resolved`,
      timestamp: item.createdAt || item.date,
    }));

  const claimEvents = claims
    .filter((claim) => claim.claimedAt)
    .map((claim) => ({
      type: "claim",
      message: `${findUserName(claim.userId)} submitted a claim`,
      timestamp: claim.claimedAt,
    }));

  return [...itemEvents, ...resolvedEvents, ...claimEvents]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);
}

// TEMPORARY, DEV-ONLY FALLBACK: reshapes our json-server mock items to
// match the real backend's item shape (imageUrl, type: "LOST"/"FOUND",
// status: "RESOLVED"/"OPEN", createdAt) — used only when the real
// /public/latest-items endpoint is unreachable, so Home.jsx can render
// either source without needing to know which one it got.
export async function getLatestItemsMock(limit = 6) {
  const items = await getRecentItems(limit); // already sorted newest-first

  return items.map((item) => ({
    id: item.id,
    title: item.title,
    location: item.location,
    type: item.status === "lost" ? "LOST" : "FOUND",
    status: item.resolved ? "RESOLVED" : "OPEN",
    createdAt: item.createdAt || item.date,
    imageUrl: null, // our mock data has no real images
  }));
}

import { useAuthStore } from "../store/authStore";
import {
  getAdminListings,
  getAdminListing,
  deleteAdminListing,
  getAdminCategories,
  getAdminColors,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  createAdminColor,
  updateAdminColor,
  deleteAdminColor,
} from "../api/adminApi";

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
  return request(`/users/${getMockUserId()}`);
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
  // These rules live here (not only in the UI), so they hold no matter
  // which screen submits a claim.
  if (!data.userId) {
    throw friendlyError("Please log in again before submitting a claim.");
  }

  const [targetItem, existingClaims] = await Promise.all([
    getItemById(data.itemId),
    getClaims(),
  ]);

  if (targetItem.resolved) {
    throw friendlyError(
      "This item is already resolved, so it can't be claimed.",
    );
  }

  if (targetItem.userId === data.userId) {
    throw friendlyError("You can't claim your own post.");
  }

  const hasPendingClaim = existingClaims.some(
    (claim) =>
      claim.itemId === data.itemId &&
      claim.userId === data.userId &&
      claim.status === "pending",
  );
  if (hasPendingClaim) {
    throw friendlyError("You already have a pending claim on this item.");
  }

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
// export async function getLatestItemsMock(limit = 6) {
//   const items = await getRecentItems(limit); // already sorted newest-first

//   return items.map((item) => ({
//     id: item.id,
//     title: item.title,
//     location: item.location,
//     type: item.status === "lost" ? "LOST" : "FOUND",
//     status: item.resolved ? "RESOLVED" : "OPEN",
//     createdAt: item.createdAt || item.date,
//     imageUrl: null, // our mock data has no real images
//   }));
// }

// Deletes an item AND all claims associated with it - matches the admin
// "Delete this listing?" confirmation copy, which explicitly says
// deleting removes the listing's claim history too, not just the item.
export async function deleteItem(itemId) {
  const claims = await getClaimsForItem(itemId);
  await Promise.all(
    claims.map((claim) => request(`/claims/${claim.id}`, { method: "DELETE" })),
  );
  return request(`/items/${itemId}`, { method: "DELETE" });
}

// ===== Profile / account helpers (json-server mock mode) =====
// Everything below is only reached through DEV-ONLY fallbacks, when the
// real backend is unreachable. None of it touches the real backend flow.

// Real backend ids are UUIDs. Mock (json-server) ids never match this
// pattern — even random ones containing dashes, like "IyYDZI-r4ZM".
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isRealBackendUserId(id) {
  return UUID_PATTERN.test(String(id ?? ""));
}

// Which json-server user the mock profile/edit/delete should act on.
// A real-backend session (UUID) has no matching mock user, so we use
// mock user "1" (David) — same behavior getCurrentUser always had.
function getMockUserId() {
  const { user } = useAuthStore.getState();
  if (!user?.id || isRealBackendUserId(user.id)) return "1";
  return String(user.id);
}

// The real backend stores profession as an enum (STUDENT/TEACHER/WORKER),
// but older mock users have "Student", "Worker", or "Preferred not to say".
// Normalize so the profile page and edit form behave the same either way.
const PROFESSION_ENUMS = ["STUDENT", "TEACHER", "WORKER"];
function normalizeProfession(value) {
  const upper = String(value || "").toUpperCase();
  return PROFESSION_ENUMS.includes(upper) ? upper : "";
}

// Builds a profile shaped like the real backend's /auth/profile response,
// including the "stats" object that powers the four KPI cards:
//   itemReports    = posts the user made (lost + found)
//   itemsFound     = posts of type "found"
//   claimsSubmitted= claims the user filed on other people's items
//   itemsReturned  = the user's posts that are resolved
export async function getMockProfile() {
  const userId = getMockUserId();
  const [user, items, claims] = await Promise.all([
    request(`/users/${userId}`),
    getItems(),
    getClaims(),
  ]);

  const myItems = items.filter((item) => item.userId === user.id);

  // Never hand passwords to UI components, even mock ones.
  const safeUser = { ...user };
  delete safeUser.password;
  delete safeUser.confirmPassword;

  return {
    ...safeUser,
    profession: normalizeProfession(user.profession),
    stats: {
      itemReports: myItems.length,
      itemsFound: myItems.filter((item) => item.status === "found").length,
      claimsSubmitted: claims.filter((claim) => claim.userId === user.id)
        .length,
      itemsReturned: myItems.filter((item) => item.resolved).length,
    },
  };
}

// Saves the Edit Profile form to json-server. Receives the SAME FormData
// object the real backend would get (fullName, phone, socialMedia,
// profession, aboutMe, optional profileImage), so EditProfile.jsx doesn't
// need to know which one is answering.
// NOTE: json-server can't store files, so profileImage is ignored here.
export async function updateMockProfile(formData) {
  const fullName = String(formData.get("fullName") || "").trim();
  const [firstName, ...rest] = fullName.split(/\s+/);

  const updates = {
    firstName,
    lastName: rest.join(" "),
    phone: String(formData.get("phone") || "").trim(),
    socialMedia: String(formData.get("socialMedia") || "").trim(),
    aboutMe: String(formData.get("aboutMe") || "").trim(),
  };

  const profession = formData.get("profession");
  if (profession) updates.profession = String(profession);

  return updateUser(getMockUserId(), updates);
}

// Deletes a mock account and everything tied to it: the user, their
// posts, claims they filed, and claims other people filed on their posts.
export async function deleteUserAccount(userId) {
  const [items, claims] = await Promise.all([getItems(), getClaims()]);

  const ownItemIds = items
    .filter((item) => item.userId === userId)
    .map((item) => item.id);

  const claimsToDelete = claims.filter(
    (claim) => claim.userId === userId || ownItemIds.includes(claim.itemId),
  );

  await Promise.all(
    claimsToDelete.map((claim) =>
      request(`/claims/${claim.id}`, { method: "DELETE" }),
    ),
  );
  await Promise.all(
    ownItemIds.map((id) => request(`/items/${id}`, { method: "DELETE" })),
  );

  return request(`/users/${userId}`, { method: "DELETE" });
}

// ===== Attributes: categories & colours (json-server mock) =====
//
// Items store the attribute NAME (item.category = "Bags",
// item.color = "Black"), not an id. So renaming or deleting a value must
// also update every item that uses it — the helpers below do that.

// The value deleted items get moved to. It always has to exist, so it
// can't be deleted or renamed.
export const FALLBACK_ATTRIBUTE = "Other";

export function sameAttributeName(a, b) {
  return (
    String(a ?? "")
      .trim()
      .toLowerCase() ===
    String(b ?? "")
      .trim()
      .toLowerCase()
  );
}

export function isFallbackAttribute(name) {
  return sameAttributeName(name, FALLBACK_ATTRIBUTE);
}

// Keeps "Other" at the bottom of every list, wherever it's shown.
function sortFallbackLast(list) {
  return [...list].sort(
    (a, b) =>
      Number(isFallbackAttribute(a.name)) - Number(isFallbackAttribute(b.name)),
  );
}

export async function getCategories() {
  return sortFallbackLast(await request("/categories"));
}

export async function getColours() {
  return sortFallbackLast(await request("/colours"));
}

async function createAttribute(collection, data) {
  const name = data.name.trim();
  const existing = await request(`/${collection}`);

  if (existing.some((entry) => sameAttributeName(entry.name, name))) {
    throw new Error(`"${name}" already exists.`);
  }

  return request(`/${collection}`, {
    method: "POST",
    body: JSON.stringify({ ...data, name }),
  });
}

async function updateAttribute(collection, itemField, id, data) {
  const name = data.name.trim();
  const existing = await request(`/${collection}`);
  const current = existing.find((entry) => entry.id === id);

  if (!current) throw new Error("This value no longer exists.");

  if (
    existing.some(
      (entry) => entry.id !== id && sameAttributeName(entry.name, name),
    )
  ) {
    throw new Error(`"${name}" already exists.`);
  }

  if (isFallbackAttribute(current.name) && !isFallbackAttribute(name)) {
    throw new Error(
      `"${FALLBACK_ATTRIBUTE}" is the fallback value and can't be renamed.`,
    );
  }

  const updated = await request(`/${collection}/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ ...data, name }),
  });

  // Copy a rename onto every item still using the old name.
  if (current.name !== name) {
    const items = await request("/items");
    await Promise.all(
      items
        .filter((item) => sameAttributeName(item[itemField], current.name))
        .map((item) =>
          request(`/items/${item.id}`, {
            method: "PATCH",
            body: JSON.stringify({ [itemField]: name }),
          }),
        ),
    );
  }

  return updated;
}

async function deleteAttribute(collection, itemField, id) {
  const existing = await request(`/${collection}`);
  const current = existing.find((entry) => entry.id === id);

  if (!current) throw new Error("This value no longer exists.");

  if (isFallbackAttribute(current.name)) {
    throw new Error(
      `"${FALLBACK_ATTRIBUTE}" is the fallback value and can't be deleted.`,
    );
  }

  // Move affected items to "Other" first, then delete — never the reverse,
  // or a failure halfway would leave items pointing at a deleted value.
  const items = await request("/items");
  const affected = items.filter((item) =>
    sameAttributeName(item[itemField], current.name),
  );

  await Promise.all(
    affected.map((item) =>
      request(`/items/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ [itemField]: FALLBACK_ATTRIBUTE }),
      }),
    ),
  );

  await request(`/${collection}/${id}`, { method: "DELETE" });

  return { reassigned: affected.length };
}

// Items use the American spelling ("color") for the field name.
export const createCategory = (data) => createAttribute("categories", data);
export const updateCategory = (id, data) =>
  updateAttribute("categories", "category", id, data);
export const deleteCategory = (id) =>
  deleteAttribute("categories", "category", id);

export const createColour = (data) => createAttribute("colours", data);
export const updateColour = (id, data) =>
  updateAttribute("colours", "color", id, data);
export const deleteColour = (id) => deleteAttribute("colours", "color", id);

// ===== Owner actions: edit/delete a post, cancel a claim =====

// Errors raised on purpose by our own rules (as opposed to network or
// server failures) carry a "friendly" flag, so the UI can show their
// message directly instead of a generic "something went wrong".
function friendlyError(message) {
  const error = new Error(message);
  error.friendly = true;
  return error;
}

// Loads an item and makes sure the current user owns it.
async function getOwnedItem(itemId) {
  const item = await getItemById(itemId);

  if (item.userId !== getMockUserId()) {
    throw friendlyError("You can only change your own posts.");
  }

  return item;
}

// Saves edits to one of the user's own posts. Only these fields can
// change: the post type (lost/found), contact details and owner are fixed.
export async function updatePost(itemId, updates) {
  const item = await getOwnedItem(itemId);

  if (item.resolved) {
    throw friendlyError("Resolved posts can't be edited.");
  }

  const editableFields = [
    "title",
    "category",
    "color",
    "location",
    "date",
    "description",
  ];
  const changes = {};
  editableFields.forEach((field) => {
    if (field in updates) changes[field] = updates[field];
  });

  return request(`/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ ...changes, updatedAt: new Date().toISOString() }),
  });
}

// Deletes one of the user's own posts. deleteItem (from Manage Listings)
// also removes every claim made on it.
export async function deletePost(itemId) {
  await getOwnedItem(itemId);
  return deleteItem(itemId);
}

// Deletes one of the user's own claims, but only while it's still pending.
export async function cancelClaim(claimId) {
  const claim = await getClaimById(claimId);

  if (claim.userId !== getMockUserId()) {
    throw friendlyError("You can only delete your own claims.");
  }

  if (claim.status !== "pending") {
    throw friendlyError("Only pending claims can be deleted.");
  }

  return request(`/claims/${claimId}`, { method: "DELETE" });
}

// ===== Fallbacks for the real backend's public item endpoints =====
//
// The real API and our json-server mock use different field names for
// the same things (type "LOST"/"FOUND" vs status "lost"/"found", a
// nested category/color OBJECT vs a plain string, dateLostOrFound vs
// date...). These helpers reshape our mock data to match the REAL
// shape, so every page that already expects the real shape (Item List,
// Home, New Post) works identically no matter which source answered.

function toBackendShapedItem(mockItem) {
  return {
    id: mockItem.id,
    title: mockItem.title,
    location: mockItem.location,
    description: mockItem.description || "",
    type: mockItem.status === "lost" ? "LOST" : "FOUND",
    status: mockItem.resolved ? "RESOLVED" : "OPEN",
    resolved: Boolean(mockItem.resolved),
    dateLostOrFound: mockItem.date,
    category: mockItem.category
      ? { id: mockItem.category, name: mockItem.category }
      : null,
    color: mockItem.color ? { id: mockItem.color, name: mockItem.color } : null,
    images: [],
    userId: mockItem.userId,
    createdAt: mockItem.createdAt,
  };
}

// Fallback for GET /public/items?limit=6 (Home's "Recently Reported").
export async function getLatestItemsMock(limit = 6) {
  const items = await getRecentItems(limit);
  return items.map(toBackendShapedItem);
}

// Fallback for GET /public/items (Item List: search, filter, paginate).
// Applies the same filters the real endpoint accepts, then paginates,
// returning the same { data, pagination } envelope.
export async function getItemsMockPaginated(params = {}) {
  const allItems = (await getItems()).map(toBackendShapedItem);

  const filtered = allItems.filter((item) => {
    if (params.search) {
      const q = params.search.toLowerCase();
      if (!item.title.toLowerCase().includes(q)) return false;
    }
    if (params.type && item.type !== params.type) return false;
    if (params.status && item.status !== params.status) return false;
    if (params.category && item.category?.name !== params.category) {
      return false;
    }
    if (params.color && item.color?.name !== params.color) return false;
    if (params.fromDate && item.dateLostOrFound < params.fromDate) {
      return false;
    }
    if (params.toDate && item.dateLostOrFound > params.toDate) return false;
    return true;
  });

  const page = params.page || 1;
  const limit = params.limit || 9;
  const start = (page - 1) * limit;

  return {
    data: filtered.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / limit)),
    },
  };
}

// Fallback for POST /item/createNewPost. Reads the SAME FormData
// New Post already builds (type, title, categoryId, location, colorId,
// dateLostOrFound, description). categoryId/colorId only resolve
// correctly if the dropdown was ALSO populated from mock data (i.e. the
// real backend was already down when the form loaded) — if the real
// backend answered the categories/colors call but then failed on
// submit, these ids won't match our mock collections, and we say so
// rather than silently creating the wrong item.
// json-server can't store files, so any selected images are skipped.
export async function createItemMockFromFormData(formData) {
  const [categories, colours, user] = await Promise.all([
    getCategories(),
    getColours(),
    getCurrentUser(),
  ]);

  const category = categories.find((c) => c.id === formData.get("categoryId"));
  const colour = colours.find((c) => c.id === formData.get("colorId"));

  if (!category || !colour) {
    throw friendlyError(
      "Couldn't match the selected category/colour to local test data — try reselecting them and submitting again.",
    );
  }

  return createItemWithSequentialId({
    title: String(formData.get("title") || "").trim(),
    status: String(formData.get("type") || "LOST").toLowerCase(),
    category: category.name,
    color: colour.name,
    location: String(formData.get("location") || "").trim(),
    date: String(formData.get("dateLostOrFound") || ""),
    description: String(formData.get("description") || "").trim(),
    resolved: false,
    userId: user.id,
    postedBy: {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
    },
  });
}

// ===== Fallbacks for single-item view, claim creation, My Posts, My
// Claims, Claims Received, and the accepted-claim contact view =====
// All reshape mock data into whatever shape the REAL backend's
// equivalent endpoint returns, so the pages/hooks calling these never
// need to know which source actually answered.

export async function getItemByIdMock(id) {
  const item = await getItemById(id);
  return toBackendShapedItem(item);
}

// Backs useCreateClaim's fallback. Reuses createClaim's own rule
// enforcement (no claiming your own post, no claiming resolved items,
// no duplicate pending claims) — those errors are already marked
// `.friendly`, which ItemDetailsModal already knows how to display.
export async function createClaimMockFromBackendShape({ itemId, message }) {
  const user = await getCurrentUser();
  return createClaim({
    itemId,
    userId: user.id,
    status: "pending",
    message,
    claimedAt: new Date().toISOString(),
  });
}

export async function getMyPostsMock() {
  const user = await getCurrentUser();
  const [items, claims] = await Promise.all([
    getItemsByUser(user.id),
    getClaims(),
  ]);

  const data = items.map((item) => {
    const pendingClaimsCount = claims.filter(
      (c) => c.itemId === item.id && c.status === "pending",
    ).length;
    return { ...toBackendShapedItem(item), pendingClaimsCount };
  });

  return { data };
}

export async function getMyClaimsMock({
  page = 1,
  limit = 6,
  claimStatus,
} = {}) {
  const user = await getCurrentUser();
  const allClaims = await getClaimsByUser(user.id);

  const withItem = await Promise.all(
    allClaims.map(async (claim) => ({
      ...claim,
      status: claim.status.toUpperCase(),
      item: toBackendShapedItem(await getItemById(claim.itemId)),
    })),
  );

  const counts = {
    all: withItem.length,
    pending: withItem.filter((c) => c.status === "PENDING").length,
    accepted: withItem.filter((c) => c.status === "ACCEPTED").length,
    declined: withItem.filter((c) => c.status === "DECLINED").length,
  };

  const filtered = claimStatus
    ? withItem.filter((c) => c.status === claimStatus)
    : withItem;

  const start = (page - 1) * limit;

  return {
    data: filtered.slice(start, start + limit),
    counts,
    pagination: {
      totalPages: Math.max(1, Math.ceil(filtered.length / limit)),
    },
  };
}

// Backs PostClaims.jsx's fallback for "Claims Received".
export async function getMyItemClaimsMock(itemId) {
  const [item, claims, users] = await Promise.all([
    getItemById(itemId),
    getClaimsForItem(itemId),
    getUsers(),
  ]);

  const claimsWithClaimant = claims.map((claim) => {
    const claimant = users.find((u) => u.id === claim.userId);
    return {
      ...claim,
      status: claim.status.toUpperCase(),
      createdAt: claim.claimedAt,
      claimant: claimant
        ? {
            firstName: claimant.firstName,
            lastName: claimant.lastName,
            profileUrl: null,
          }
        : { firstName: "Unknown", lastName: "", profileUrl: null },
    };
  });

  return { item: toBackendShapedItem(item), claims: claimsWithClaimant };
}

// Backs PostClaims.jsx's fallback for Accept/Decline. "Accepted" does the
// full cascade ourselves (decline every other pending claim on this item,
// mark the item resolved), since the real backend presumably does this
// server-side and the mock has nothing else to trigger it.
export async function updateItemClaimStatusMock(itemId, claimId, status) {
  const normalized = status.toLowerCase();

  if (normalized === "accepted") {
    const claims = await getClaimsForItem(itemId);
    const others = claims.filter(
      (c) => c.id !== claimId && c.status === "pending",
    );

    await Promise.all([
      updateClaimStatus(claimId, "accepted"),
      ...others.map((c) => updateClaimStatus(c.id, "declined")),
      updateItemStatus(itemId, { resolved: true }),
    ]);
  } else {
    await updateClaimStatus(claimId, normalized);
  }

  return { success: true };
}

// Backs AcceptedClaimView.jsx's fallback.
export async function getAcceptedClaimContactMock(itemId, claimId) {
  const claim = await getClaimById(claimId);
  const claimant = await getUserById(claim.userId);

  return {
    firstName: claimant.firstName,
    lastName: claimant.lastName,
    phone: claimant.phone || null,
    email: claimant.email,
    profileUrl: null,
  };
}

// ===== Admin: manage users =====

// All users, each with their role (defaulting to "user" if unset) and
// live post/claim counts — used by the Manage Users table.
export async function getAllUsersWithStats() {
  const [users, items, claims] = await Promise.all([
    getUsers(),
    getItems(),
    getClaims(),
  ]);

  return users.map((user) => ({
    ...user,
    role: user.role || "USER",
    postsCount: items.filter((item) => item.userId === user.id).length,
    claimsCount: claims.filter((claim) => claim.userId === user.id).length,
  }));
}

// Full detail for the "view" modal: the user, every item they posted,
// and every claim they made (with the claimed item's title attached, so
// the claim history is readable without a second lookup per row).
export async function getUserFullDetails(userId) {
  const [user, items, claims] = await Promise.all([
    getUserById(userId),
    getItemsByUser(userId),
    getClaimsByUser(userId),
  ]);

  const claimsWithItemTitles = await Promise.all(
    claims.map(async (claim) => {
      const item = await getItemById(claim.itemId).catch(() => null);
      return { ...claim, itemTitle: item?.title || "Unknown item" };
    }),
  );

  return { user, items, claims: claimsWithItemTitles };
}

export async function promoteToAdmin(userId) {
  return updateUser(userId, { role: "ADMIN" });
}

export async function demoteToUser(userId) {
  const user = await request(`/users/${userId}`);
  if (user.role === "SUPERADMIN") {
    throw friendlyError("Super Admins can't be demoted.");
  }
  return updateUser(userId, { role: "USER" });
}

// Reuses deleteUserAccount (removes the user, their posts, and every
// claim tied to them), with one extra rule: Super Admin accounts are
// protected and can never be deleted, by anyone, through this page.
export async function deleteUserByAdmin(userId) {
  const user = await request(`/users/${userId}`);
  if (user.role === "SUPERADMIN") {
    throw friendlyError("Super Admin accounts can't be deleted.");
  }
  return deleteUserAccount(userId);
}

// Fallback for GET /admin/dashboard. Reshapes our existing mock stat
// helpers into the real endpoint's { summary, itemsByCategory,
// recentActivity } envelope.
export async function getAdminDashboardMock(period = "ALL_TIME") {
  const periodMap = {
    ALL_TIME: "all",
    THIS_YEAR: "year",
    THIS_MONTH: "month",
    THIS_WEEK: "week",
    TODAY: "day",
  };

  const [summary, categoryCounts, activity] = await Promise.all([
    getAdminStats(),
    getItemsByCategory(periodMap[period] || "all"),
    getRecentActivity(12),
  ]);

  return {
    summary,
    itemsByCategory: Object.entries(categoryCounts).map(([name, count]) => ({
      name,
      count,
    })),
    recentActivity: activity.map((event, i) => ({
      id: `mock-${i}`,
      type:
        event.type === "claim"
          ? "CLAIM_SUBMITTED"
          : event.type === "resolved"
            ? "ITEM_RESOLVED"
            : "ITEM_POSTED",
      message: event.message,
      occurredAt: event.timestamp,
    })),
  };
}

// ===== Fallbacks for the real admin endpoints (Manage Listings / Manage
// Attributes). These reshape our json-server mock data into whatever
// shape the REAL admin endpoints return, so ManageListings.jsx and
// ManageAttributes.jsx work identically no matter which source answered.

export function isBackendUnreachable(error) {
  return !error?.response || error.response.status >= 500;
}

// ---------- Manage Listings ----------

export async function getAdminListingsMock(params = {}) {
  const [items, users, categories] = await Promise.all([
    getItems(),
    getUsers(),
    getCategories(),
  ]);

  const categoryName = params.categoryId
    ? categories.find((c) => c.id === params.categoryId)?.name
    : undefined;

  const filtered = items.filter((item) => {
    if (params.search) {
      const q = params.search.toLowerCase();
      if (!item.title.toLowerCase().includes(q)) return false;
    }
    if (params.status) {
      const itemStatus = item.resolved ? "RESOLVED" : "OPEN";
      if (itemStatus !== params.status) return false;
    }
    if (params.type) {
      const itemType = item.status === "lost" ? "LOST" : "FOUND";
      if (itemType !== params.type) return false;
    }
    if (categoryName && item.category !== categoryName) return false;
    return true;
  });

  const page = params.page || 1;
  const limit = params.limit || 8;
  const start = (page - 1) * limit;

  const data = filtered.slice(start, start + limit).map((item) => {
    const user = users.find((u) => u.id === item.userId);
    return {
      id: item.id,
      title: item.title,
      type: item.status === "lost" ? "LOST" : "FOUND",
      status: item.resolved ? "RESOLVED" : "OPEN",
      category: { id: item.category, name: item.category || "Other" },
      user: user
        ? { firstName: user.firstName, lastName: user.lastName }
        : { firstName: "Unknown", lastName: "" },
      createdAt: item.createdAt || item.date,
    };
  });

  return {
    data,
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / limit)),
    },
  };
}

export async function getAdminListingMock(itemId) {
  const [item, claims, users] = await Promise.all([
    getItemById(itemId),
    getClaimsForItem(itemId),
    getUsers(),
  ]);

  const owner = users.find((u) => u.id === item.userId);

  const claimsWithClaimant = claims.map((claim) => {
    const claimant = users.find((u) => u.id === claim.userId);
    return {
      ...claim,
      claimant: claimant
        ? { firstName: claimant.firstName, lastName: claimant.lastName }
        : { firstName: "Unknown", lastName: "" },
      createdAt: claim.claimedAt,
    };
  });

  return {
    id: item.id,
    title: item.title,
    description: item.description || "",
    type: item.status === "lost" ? "LOST" : "FOUND",
    status: item.resolved ? "RESOLVED" : "OPEN",
    category: { name: item.category || "Other" },
    color: { name: item.color || "Other" },
    dateLostOrFound: item.date,
    images: [],
    poster: {
      name: owner ? `${owner.firstName} ${owner.lastName}` : "Unknown",
      phone: owner?.phone || null,
      email: owner?.email || null,
    },
    claims: claimsWithClaimant,
  };
}

export async function fetchAdminListingsWithFallback(params, options) {
  try {
    return await getAdminListings(params, options);
  } catch (error) {
    if (import.meta.env.DEV && isBackendUnreachable(error)) {
      return await getAdminListingsMock(params);
    }
    throw error;
  }
}

export async function fetchAdminListingWithFallback(itemId) {
  try {
    return await getAdminListing(itemId);
  } catch (error) {
    if (import.meta.env.DEV && isBackendUnreachable(error)) {
      return await getAdminListingMock(itemId);
    }
    throw error;
  }
}

export async function deleteAdminListingWithFallback(itemId) {
  try {
    return await deleteAdminListing(itemId);
  } catch (error) {
    if (import.meta.env.DEV && isBackendUnreachable(error)) {
      return await deleteItem(itemId);
    }
    throw error;
  }
}

// ---------- Manage Attributes ----------

export async function getAdminCategoriesMock() {
  const [categories, items] = await Promise.all([getCategories(), getItems()]);
  return categories.map((c) => ({
    ...c,
    itemCount: items.filter((item) => sameAttributeName(item.category, c.name))
      .length,
  }));
}

export async function getAdminColorsMock() {
  const [colours, items] = await Promise.all([getColours(), getItems()]);
  return colours.map((c) => ({
    ...c,
    hexCode: c.hex,
    itemCount: items.filter((item) => sameAttributeName(item.color, c.name))
      .length,
  }));
}

export async function fetchAdminCategoriesWithFallback() {
  try {
    return await getAdminCategories();
  } catch (error) {
    if (import.meta.env.DEV && isBackendUnreachable(error)) {
      return await getAdminCategoriesMock();
    }
    throw error;
  }
}

export async function fetchAdminColorsWithFallback() {
  try {
    return await getAdminColors();
  } catch (error) {
    if (import.meta.env.DEV && isBackendUnreachable(error)) {
      return await getAdminColorsMock();
    }
    throw error;
  }
}

export async function createAdminCategoryWithFallback(data) {
  try {
    return await createAdminCategory(data);
  } catch (error) {
    if (import.meta.env.DEV && isBackendUnreachable(error)) {
      return await createCategory(data);
    }
    throw error;
  }
}

export async function updateAdminCategoryWithFallback(id, data) {
  try {
    return await updateAdminCategory(id, data);
  } catch (error) {
    if (import.meta.env.DEV && isBackendUnreachable(error)) {
      return await updateCategory(id, data);
    }
    throw error;
  }
}

export async function deleteAdminCategoryWithFallback(id) {
  try {
    return await deleteAdminCategory(id);
  } catch (error) {
    if (import.meta.env.DEV && isBackendUnreachable(error)) {
      return await deleteCategory(id);
    }
    throw error;
  }
}

export async function createAdminColorWithFallback(data) {
  try {
    return await createAdminColor(data);
  } catch (error) {
    if (import.meta.env.DEV && isBackendUnreachable(error)) {
      return await createColour(data);
    }
    throw error;
  }
}

export async function updateAdminColorWithFallback(id, data) {
  try {
    return await updateAdminColor(id, data);
  } catch (error) {
    if (import.meta.env.DEV && isBackendUnreachable(error)) {
      return await updateColour(id, data);
    }
    throw error;
  }
}

export async function deleteAdminColorWithFallback(id) {
  try {
    return await deleteAdminColor(id);
  } catch (error) {
    if (import.meta.env.DEV && isBackendUnreachable(error)) {
      return await deleteColour(id);
    }
    throw error;
  }
}

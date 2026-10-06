import { useQuery } from "@tanstack/react-query";
import { getMyClaimDetails } from "../api/itemsApi";
import { getClaimById, getItemById, getUserById } from "../services/api";

function isBackendUnreachable(error) {
  return !error?.response || error.response.status >= 500;
}

async function getMyClaimDetailsMock(claimId) {
  const claim = await getClaimById(claimId);
  const item = await getItemById(claim.itemId);
  const owner =
    item.postedBy || (item.userId ? await getUserById(item.userId) : null);
  const status = (claim.status || "").toLowerCase();

  return {
    ...claim,
    status,
    createdAt: claim.createdAt || claim.claimedAt,
    item: {
      ...item,
      status:
        item.status === "lost" || item.status === "found"
          ? item.status
          : item.type === "LOST"
            ? "lost"
            : "found",
    },
    ...(status === "accepted" &&
      owner && {
        poster: {
          name:
            owner.name ||
            `${owner.firstName ?? ""} ${owner.lastName ?? ""}`.trim(),
          phone: owner.phone,
          email: owner.email,
        },
      }),
  };
}

async function fetchMyClaimDetails(claimId) {
  try {
    return await getMyClaimDetails(claimId);
  } catch (error) {
    if (import.meta.env.DEV && isBackendUnreachable(error)) {
      return await getMyClaimDetailsMock(claimId);
    }
    throw error;
  }
}

function normalizeClaimDetails(claim) {
  const poster = claim.poster
    ? {
        ...claim.poster,
        name:
          claim.poster.name ||
          `${claim.poster.firstName ?? ""} ${claim.poster.lastName ?? ""}`.trim(),
      }
    : undefined;

  return {
    ...claim,
    status: claim.status.toLowerCase(),
    claimedAt: claim.createdAt || claim.claimedAt,
    message: claim.message || "",
    item: {
      ...claim.item,
      status:
        claim.item.status === "OPEN" || claim.item.status === "RESOLVED"
          ? claim.item.type.toLowerCase()
          : claim.item.status || claim.item.type.toLowerCase(),
      postedBy: poster,
    },
  };
}

export function useMyClaimDetails(claimId) {
  return useQuery({
    queryKey: ["my-claim", claimId],
    queryFn: async () =>
      normalizeClaimDetails(await fetchMyClaimDetails(claimId)),
    enabled: Boolean(claimId),
  });
}

import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "../api/adminApi";
import { getAdminDashboardMock } from "../services/api";

function isBackendUnreachable(error) {
  return !error?.response || error.response.status >= 500;
}

async function fetchDashboardWithFallback(period) {
  try {
    return await getAdminDashboard(period);
  } catch (error) {
    if (import.meta.env.DEV && isBackendUnreachable(error)) {
      return await getAdminDashboardMock(period);
    }
    throw error;
  }
}

export function useAdminDashboard(period = "ALL_TIME") {
  return useQuery({
    queryKey: ["admin-dashboard", period],
    queryFn: () => fetchDashboardWithFallback(period),
  });
}

import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "../api/adminApi";

export function useAdminDashboard(period = "ALL_TIME") {
  return useQuery({
    queryKey: ["admin-dashboard", period],
    queryFn: () => getAdminDashboard(period),
  });
}

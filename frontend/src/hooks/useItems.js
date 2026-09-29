import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { getItems } from "../api/publicApi";
import { createItem } from "../api/itemsApi";

export const useItems = (params) => {
  return useQuery({
    queryKey: ["items", params],
    queryFn: () => getItems(params),
    placeholderData: keepPreviousData,
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createItem,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["items"],
      });

      queryClient.invalidateQueries({
        queryKey: ["my-items"],
      });
    },
  });
};

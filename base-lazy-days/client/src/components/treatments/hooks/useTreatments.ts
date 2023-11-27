import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Treatment } from "../../../../../shared/types";
import { axiosInstance } from "../../../axiosInstance";
import { queryKeys } from "../../../react-query/constants";

async function getTreatments(): Promise<Treatment[]> {
    const { data } = await axiosInstance.get("/treatments");
    return data;
}

export function useTreatments(): Treatment[] {
    const fallback = [];
    const { data = fallback } = useQuery({
        queryKey: [queryKeys.treatments],
        queryFn: getTreatments,
        staleTime: 600000,
        gcTime: 900000,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });

    return data;
}

export function usePrefetchTreatments() {
    const queryClient = useQueryClient();
    queryClient.prefetchQuery({
        queryKey: [queryKeys.treatments],
        queryFn: getTreatments,
    });
}

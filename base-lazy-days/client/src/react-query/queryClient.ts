import { QueryCache, QueryClient } from "@tanstack/react-query";
import { createStandaloneToast } from "@chakra-ui/react";
import { theme } from "../theme";

const { toast } = createStandaloneToast({ theme });

function queryErrorHandler(error: unknown): void {
    const title =
        error instanceof Error ? error.message : "error connecting to server";

    toast({ title, status: "error", variant: "subtle", isClosable: true });
}

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 600000,
            gcTime: 900000,
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
        },
    },
    queryCache: new QueryCache({
        onError: queryErrorHandler,
    }),
});

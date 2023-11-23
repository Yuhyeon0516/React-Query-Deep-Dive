import { ChakraProvider } from "@chakra-ui/react";
import { ReactElement } from "react";

import { theme } from "../../theme";
import { Loading } from "./Loading";
import { Navbar } from "./Navbar";
import { Routes } from "./Routes";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "react-query/queryClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function App(): ReactElement {
    return (
        <ChakraProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <Navbar />
                <Loading />
                <Routes />
                <ReactQueryDevtools />
            </QueryClientProvider>
        </ChakraProvider>
    );
}

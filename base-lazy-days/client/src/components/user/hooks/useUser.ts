import { AxiosResponse } from "axios";

import type { User } from "../../../../../shared/types";
import { axiosInstance, getJWTHeader } from "../../../axiosInstance";
import { queryKeys } from "../../../react-query/constants";
import {
    clearStoredUser,
    getStoredUser,
    setStoredUser,
} from "../../../user-storage";
import { useQuery, useQueryClient } from "@tanstack/react-query";

async function getUser(user: User | null): Promise<User | null> {
    if (!user) return null;
    const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
        `/user/${user.id}`,
        {
            headers: getJWTHeader(user),
        }
    );
    return data.user;
}

interface UseUser {
    user: User | null;
    updateUser: (user: User) => void;
    clearUser: () => void;
}

export function useUser(): UseUser {
    const queryClient = useQueryClient();
    const { data: user } = useQuery({
        queryKey: [queryKeys.user],
        queryFn: () => getUser(user),
        initialData: getStoredUser,
    });

    // meant to be called from useAuth
    function updateUser(newUser: User): void {
        queryClient.setQueryData([queryKeys.user], newUser);
        setStoredUser(newUser);
    }

    // meant to be called from useAuth
    function clearUser() {
        queryClient.setQueryData([queryKeys.user], null);
        clearStoredUser();
        queryClient.removeQueries({
            queryKey: [queryKeys.appointments, queryKeys.user],
        });
    }

    return { user, updateUser, clearUser };
}

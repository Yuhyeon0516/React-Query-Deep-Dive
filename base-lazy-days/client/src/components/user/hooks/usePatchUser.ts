import jsonpatch from "fast-json-patch";

import type { User } from "../../../../../shared/types";
import { axiosInstance, getJWTHeader } from "../../../axiosInstance";
import { useUser } from "./useUser";
import {
    UseMutateFunction,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { useCustomToast } from "components/app/hooks/useCustomToast";
import { queryKeys } from "react-query/constants";

// for when we need a server function
async function patchUserOnServer(
    newData: User | null,
    originalData: User | null
): Promise<User | null> {
    if (!newData || !originalData) return null;
    // create a patch for the difference between newData and originalData
    const patch = jsonpatch.compare(originalData, newData);

    // send patched data to the server
    const { data } = await axiosInstance.patch(
        `/user/${originalData.id}`,
        { patch },
        {
            headers: getJWTHeader(originalData),
        }
    );
    return data.user;
}

export function usePatchUser(): UseMutateFunction<
    User,
    unknown,
    User,
    unknown
> {
    const { user, updateUser } = useUser();
    const toast = useCustomToast();
    const queryClient = useQueryClient();

    const { mutate: patchUser } = useMutation({
        mutationFn: (newUserData: User) => patchUserOnServer(newUserData, user),
        onSuccess: (userData: User | null) => {
            if (user) {
                toast({
                    title: "User updated!",
                    status: "success",
                });
            }
        },
        onMutate: async (newData: User | null) => {
            queryClient.cancelQueries({
                queryKey: [queryKeys.user],
            });

            const previousUserData: User = queryClient.getQueryData([
                queryKeys.user,
            ]);
            updateUser(newData);

            return { previousUserData };
        },
        onError: (error, newData, context) => {
            if (context.previousUserData) {
                updateUser(context.previousUserData);
                toast({
                    title: "update failed, restoring previous values",
                    status: "warning",
                });
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.user],
            });
        },
    });

    return patchUser;
}

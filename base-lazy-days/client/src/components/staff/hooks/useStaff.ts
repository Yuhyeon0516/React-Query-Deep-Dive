import { Dispatch, SetStateAction, useCallback, useState } from "react";

import type { Staff } from "../../../../../shared/types";
import { axiosInstance } from "../../../axiosInstance";
import { queryKeys } from "../../../react-query/constants";
import { filterByTreatment } from "../utils";
import { useQuery } from "@tanstack/react-query";

async function getStaff(): Promise<Staff[]> {
    const { data } = await axiosInstance.get("/staff");
    return data;
}

interface UseStaff {
    staff: Staff[];
    filter: string;
    setFilter: Dispatch<SetStateAction<string>>;
}

export function useStaff(): UseStaff {
    const [filter, setFilter] = useState("all");

    const selectFunction = useCallback(
        (data) => {
            return filterByTreatment(data, filter);
        },
        [filter]
    );

    const fallback = [];
    const { data: staff = fallback } = useQuery({
        queryKey: [queryKeys.staff],
        queryFn: getStaff,
        select: filter !== "all" ? selectFunction : undefined,
    });

    return { staff, filter, setFilter };
}

import InfiniteScroll from "react-infinite-scroller";
import { Person } from "./Person";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const initialUrl = "https://swapi.dev/api/people/";
const fetchUrl = async (url) => {
    const response = await fetch(url);
    return response.json();
};

export function InfinitePeople() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isLoading,
        isError,
        error,
    } = useInfiniteQuery({
        queryKey: ["sw-people"],
        queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
        getNextPageParam: (lastPage) => lastPage.next,
    });

    if (isLoading) return <div className="loading">Loading...</div>;

    if (isError)
        return (
            <>
                <h3>Error</h3>
                <p>{error.toString()}</p>
            </>
        );

    return (
        <>
            {isFetching && <div className="loading">Loading...</div>}
            <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
                {data.pages.map((pageDate) => {
                    return pageDate.results.map((person) => {
                        return (
                            <Person
                                key={person.name}
                                name={person.name}
                                hairColor={person.hair_color}
                                eyeColor={person.eye_color}
                            />
                        );
                    });
                })}
            </InfiniteScroll>
        </>
    );
}

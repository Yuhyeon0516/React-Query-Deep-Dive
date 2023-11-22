import InfiniteScroll from "react-infinite-scroller";
import { Species } from "./Species";
import { useInfiniteQuery } from "@tanstack/react-query";

const initialUrl = "https://swapi.dev/api/species/";
const fetchUrl = async (url) => {
    const response = await fetch(url);
    return response.json();
};

export function InfiniteSpecies() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetching,
        isError,
        error,
    } = useInfiniteQuery({
        queryKey: ["sw-species"],
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
                    return pageDate.results.map((species) => {
                        return (
                            <Species
                                key={species.name}
                                name={species.name}
                                language={species.language}
                                averageLifespan={species.average_lifespan}
                            />
                        );
                    });
                })}
            </InfiniteScroll>
        </>
    );
}

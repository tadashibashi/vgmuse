import {useLocation} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";


/**
 * Caches query params
 */
export function useQuery() {
    const { search } = useLocation();

    return useMemo(() => new URLSearchParams(search), [search]);
}


/**
 * Caches query params on component load
 * @param stripQuery - whether to remove query string from address bar
 */
export const useConsumeQuery = (stripQuery: boolean = true) => {
    const { pathname, search } = useLocation();
    const query = useState(() => new URLSearchParams(search));

    if (stripQuery) {
        useEffect(() => {
                window.history.replaceState(null, "", pathname);
        }, []);
    }

    return query[0];
};

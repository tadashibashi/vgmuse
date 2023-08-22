import {Routes as ReactRoutes, Route} from "react-router-dom";
import {URLDirectory} from "../urls";

export function Routes({urls}: {urls: URLDirectory}) {

    return (
        <ReactRoutes>
            {
                Object.values(urls).map(route =>
                    <Route
                        key={route.path}
                        path={route.path}
                        element={route.page} />)
            }
        </ReactRoutes>
    );
}

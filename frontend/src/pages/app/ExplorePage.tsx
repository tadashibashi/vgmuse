import Form from "../../components/Form.tsx";
import {MagnifyingGlassIcon} from "@heroicons/react/20/solid";


export default () => {

    return (
        <div className="relative">
            <h1 className="text-2xl">Latest Tracks</h1>

            <div className="absolute -top-3 right-0">

                <Form action="/">
                    <div>
                        <label htmlFor="account-number" className="sr-only">
                            Search
                        </label>
                        <div className="relative mt-2 rounded-md shadow-sm">
                            <input
                                type="text"
                                name="search"
                                id="account-number"
                                className="block w-full rounded-md border-0 ps-3 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-400 sm:text-sm sm:leading-6"
                                placeholder="Search"
                            />
                            <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3 z-100" onClick={(e) => e.stopPropagation()}>
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </Form>

            </div>
        </div>
    );
}

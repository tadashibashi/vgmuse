export default function AuthHeader({headerText}: {headerText: string}) {
    return (
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
                className="mx-auto h-24 w-auto filter"
                src="/images/logo-v1.svg"
                alt="VGMuse Logo"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                {headerText}
            </h2>
        </div>
    );
}
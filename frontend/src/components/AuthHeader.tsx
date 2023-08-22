export default function AuthHeader({headerText, className}: {headerText: string, className?: string}) {
    return (
        <div className={className || ""}>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    className="mx-auto h-20 w-auto filter pointer-events-none"
                    src="/images/logo-v2.png"
                    alt="VGMuse Logo"
                />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 pointer-events-none">
                    {headerText}
                </h2>
            </div>
        </div>

    );
}
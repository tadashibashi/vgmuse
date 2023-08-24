export default function AuthHeader({className}: {headerText: string, className?: string}) {
    return (
        <div className={className || ""}>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    className="mx-auto h-20 w-auto filter pointer-events-none motion-safe:animate-hover-slow"
                    src="/images/logo/logo.png"
                    alt="VGMuse Logo"
                />
                <div className="flex flex-row justify-center relative">
                    <div className="absolute top-4 h-1.5 w-14 rounded-full bg-gray-300 blur-sm border-0 motion-safe:animate-shadow-hover-slow"></div>
                </div>
            </div>
        </div>

    );
}
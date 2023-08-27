import {useEffect, useState} from 'react'
import {Dialog} from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import {Link, useLocation} from "react-router-dom";
import urls from "../urls.tsx";
import FadeIn from "../components/FadeIn.tsx";

const navdata = [
    { name: 'Music', to: "#" },
    { name: 'Artists', to: '#' },
    { name: 'Store', to: '#' },
    { name: 'About', to: '#' },
]

export default function LandingPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    return (
        <FadeIn>
            <div className="bg-white">
                <header className="absolute inset-x-0 top-0 z-50">
                    <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                        <div className="flex lg:flex-1">
                            <Link to={urls.root.landingPage.path} className="-m-1.5 p-1.5">
                                <span className="sr-only">VGMuse</span>
                                <img
                                    className="h-12 w-auto -mt-2"
                                    src="/images/logo/icon-lg.png"
                                    alt=""
                                />
                            </Link>
                        </div>
                        <div className="flex lg:hidden">
                            <button
                                type="button"
                                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                                onClick={() => setMobileMenuOpen(true)}
                            >
                                <span className="sr-only">Open main menu</span>
                                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>
                        <div className="hidden lg:flex lg:gap-x-20">
                            {navdata.map((item) => (
                                <Link key={item.name} to={item.to} className="text-sm font-semibold leading-6 text-gray-900">
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                            <Link to={urls.auth.userLogin.path} className="text-sm font-semibold leading-6 text-gray-900">
                                Log in <span aria-hidden="true">&rarr;</span>
                            </Link>
                        </div>
                    </nav>

                    <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                        <div className="fixed inset-0 z-50" />
                        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                            <div className="flex items-center justify-between">
                                <Link to={urls.root.landingPage.path} className="-m-1.5 p-1.5">
                                    <span className="sr-only">VGMuse</span>
                                    <img
                                        className="h-12 w-auto"
                                        src="/images/logo/icon-lg.png"
                                        alt=""
                                    />
                                </Link>
                                <button
                                    type="button"
                                    className="-m-2.5 rounded-md p-2.5 text-gray-700"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span className="sr-only">Close menu</span>
                                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>
                            <div className="mt-6 flow-root">
                                <div className="-my-6 divide-y divide-gray-500/10">
                                    <div className="space-y-2 py-6">
                                        {navdata.map((item) => (
                                            <Link
                                                key={item.name}
                                                to={item.to}
                                                className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="py-6">
                                        <Link
                                            to={urls.auth.userLogin.path + "?last-page=" + encodeURIComponent(location.pathname)}
                                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                        >
                                            Log in
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Dialog>
                </header>

                <div className="relative isolate px-6 pt-14 lg:px-8">
                    <div
                        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-xl sm:-top-80"
                        aria-hidden="true"
                    >
                        <div
                            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#CCD3FF] to-[#E8D9FF] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                            style={{
                                clipPath:
                                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                            }}
                        />
                    </div>
                    <div className="mx-auto max-w-2xl py-16 lg:py-32">

                        <div className="relative text-center">
                            {/*Logo*/}
                            <div className="relative pointer-events-none select-none">
                                {/*Circle container*/}
                                <div className="absolute -top-16 flex justify-center opacity-25 pointer-events-none">
                                    <img alt="subtle decorative logo container" className="w-3/4 motion-safe:animate-spin-slow" src="/images/logo/circle-container.png" />
                                </div>
                                {/*Main Icon*/}
                                <div className="relative top-0 lg:top-2 flex justify-center mb-6 pointer-events-none drop-shadow-md">
                                    <img className="w-1/4 lg:w-1/4" alt="main logo" src="/images/logo/logo.png" />
                                </div>
                                <h1 className="relative top-0 lg:top-2 text-5xl font-bold text-gray-900 lg:text-6xl drop-shadow-lg">
                                    VGMUSE
                                </h1>
                                <p className="mt-6 lg:mt-10 text-md lg:text-lg leading-8 text-gray-600 drop-shadow-lg">
                                    A music library for chiptune artists and music lovers
                                </p>
                            </div>



                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <Link
                                    to={urls.app.explore.path}
                                    className="z-50 rounded-md bg-violet-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                                >
                                    Browse Music
                                </Link>
                                <Link to="#" className="z-50 text-sm font-semibold leading-6 text-gray-900 drop-shadow-md">
                                    Learn more <span aria-hidden="true">→</span>
                                </Link>
                            </div>

                        </div>
                    </div>
                    <div
                        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                        aria-hidden="true"
                    >
                        <div
                            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#B72FDE] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                            style={{
                                clipPath:
                                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                            }}
                        />
                    </div>
                </div>
            </div>
        </FadeIn>

    );
}
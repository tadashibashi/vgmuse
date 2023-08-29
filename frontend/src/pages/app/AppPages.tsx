import React, {Fragment, useEffect, useState} from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
    BellIcon,
    Cog6ToothIcon,
    GlobeEuropeAfricaIcon,
    MusicalNoteIcon,
    ArrowUpOnSquareStackIcon,
    UserIcon,
    RocketLaunchIcon,
} from '@heroicons/react/24/outline';
import {
    ChevronDownIcon,
} from '@heroicons/react/20/solid'
import {getUser, logout} from "../../api/auth.ts";
import urls, {URLDirectory} from "../../urls.tsx";
import {Link, useLocation} from "react-router-dom";
import {navigateService} from "../../services";
import {getSubpaths} from "../../lib/paths.ts";
import {Routes} from "../../components/Routes";
import MusicPlayer from "../../components/player/MusicPlayer.tsx";

const userNavbar = [
    { name: "Explore", href: "/app/explore", icon: RocketLaunchIcon, current: true },
    { name: "Muse Files", href: "/app/tracks", icon: MusicalNoteIcon, current: false },
    { name: "Upload", href: "/app/upload-track", icon: ArrowUpOnSquareStackIcon, current: false }
    // { name: 'Store', href: '#', icon: ShoppingCartIcon, current: false },
    // { name: 'Scripts', href: '#', icon: CodeBracketIcon, current: false },
    // { name: 'Stats', href: '#', icon: ChartPieIcon, current: false },
];

const guestNavbar = [
    { name: "Explore", href: "/app/explore", icon: GlobeEuropeAfricaIcon, current: true }
]

const playlists = [
    { id: 1, name: 'Coming Soon...', href: '#', initial: 'C', current: false },

];


function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function AppPages() {
    const location = useLocation();
    const [user, setUser] = useState<VGMuse.Frontend.User | null>(null);

    // Pages subpaths used in routes. Using state
    // since it gives a callback that should only be called once on component load
    const [pages, setPages] = useState<URLDirectory>(() => getSubpaths(urls.app));

    const navbar = user ? userNavbar : guestNavbar;

    async function onLogOut() {
        await logout();
        setUser(getUser());
        navigateService.get()(urls.root.landingPage.path);
    }

    const loggedInNavigation = [
        { name: 'Your profile', href: "#" },
        { name: 'Log out', onClick: onLogOut },
    ];

    const guestNavigation = [
        { name: "Log in", href: urls.auth.userLogin.path + "?last-page=" + location.pathname },
        { name: "Register", href: urls.auth.userSignUp.path + "?last-page=" + location.pathname },
    ];

    const userNavigation = user ? loggedInNavigation : guestNavigation;

    useEffect(() => {
        setUser(getUser());
    }, []);




    return (
            <>
            <div>

                {/* Static sidebar for mobile */}
                <div className="fixed inset-y-0 z-50 flex w-18 flex-col lg:hidden">
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white pb-4">
                        <div className="flex w-auto items-center">
                            <img
                                className="h-12 w-12 mx-auto mt-1 drop-shadow-md"
                                src="/images/logo/logo.png"
                                alt="Your Company"
                            />
                        </div>
                        <nav className="flex flex-1 flex-col">
                            <ul role="list" className="flex flex-1 flex-col gap-y-7 items-center">
                                <li>
                                    <ul role="list" className="space-y-1">
                                        {navbar.map((item) => (
                                            <li key={item.name} className="w-auto px-2">
                                                <Link
                                                    to={item.href}
                                                    className={classNames(
                                                        location.pathname.startsWith(item.href)
                                                            ? 'bg-gray-50 text-violet-600 shadow-sm'
                                                            : 'text-gray-700 hover:text-violet-600 hover:bg-[#fdfdfd]',
                                                        'group flex gap-x-3 rounded-md py-2 px-4 text-sm leading-6 font-semibold justify-center'
                                                    )}
                                                >
                                                    <div className="flex-col justify-center items-center p-0">
                                                        <item.icon
                                                            className={classNames(
                                                                location.pathname.startsWith(item.href) ? 'text-violet-600' : 'text-gray-400 group-hover:text-violet-600',
                                                                'h-10 shrink-0 p-1 mx-auto'
                                                            )}
                                                            aria-hidden="true"
                                                        />
                                                        <p className="text-center text-tiny">{item.name}</p>

                                                    </div>

                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </li>

                                <li className="mt-auto">
                                    <Link
                                        to="#"
                                        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-violet-600"
                                    >
                                        <Cog6ToothIcon
                                            className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-violet-600"
                                            aria-hidden="true"
                                        />
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                {/* Static sidebar for desktop */}
                <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-48 lg:flex-col">
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
                        <div className="flex h-12 shrink-0 items-center">
                            <img
                                className="h-12 w-auto mx-auto mt-2 drop-shadow-sm"
                                src="/images/logo/logo.png"
                                alt="Your Company"
                            />
                        </div>
                        <nav className="flex flex-1 flex-col">
                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                <li>
                                    <ul role="list" className="-mx-2 space-y-1">
                                        {navbar.map((item) => (
                                            <li key={item.name}>
                                                <Link
                                                    to={item.href}
                                                    className={classNames(
                                                        location.pathname.startsWith(item.href)
                                                            ? 'bg-gray-50 text-violet-600'
                                                            : 'text-gray-700 hover:text-violet-600 hover:bg-gray-50',
                                                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                    )}
                                                >
                                                    <item.icon
                                                        className={classNames(
                                                            location.pathname.startsWith(item.href) ? 'text-violet-600' : 'text-gray-400 group-hover:text-violet-600',
                                                            'h-6 w-6 shrink-0'
                                                        )}
                                                        aria-hidden="true"
                                                    />
                                                    {item.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                                <li>
                                    <div className="text-xs font-semibold leading-6 text-gray-400">Playlists</div>
                                    <ul role="list" className="-mx-2 mt-2 space-y-1">
                                        {playlists.map((playlist) => (
                                            <li key={playlist.name}>
                                                <Link
                                                    to={playlist.href}
                                                    className={classNames(
                                                        location.pathname.startsWith(playlist.href)
                                                            ? 'bg-gray-50 text-violet-600'
                                                            : 'text-gray-700 hover:text-violet-600 hover:bg-gray-50',
                                                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                    )}
                                                >
                                                    <span
                                                        className={classNames(
                                                            location.pathname.startsWith(playlist.href)
                                                                ? 'text-violet-600 border-violet-600'
                                                                : 'text-gray-400 border-gray-200 group-hover:border-violet-600 group-hover:text-violet-600',
                                                            'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'
                                                        )}
                                                    >
                                                        {playlist.initial}
                                                    </span>
                                                    <span className="truncate">{playlist.name}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                                <li className="mt-auto">
                                    <Link
                                        to="#"
                                        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-violet-600"
                                    >
                                        <Cog6ToothIcon
                                            className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-violet-600"
                                            aria-hidden="true"
                                        />
                                        Settings
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className="pl-[100px] lg:pl-48">
                    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-6 shadow-sm sm:gap-x-6 lg:px-8">

                        <div className="flex flex-1 gap-x-4 self-stretch">
                            {/*<Form shouldSubmit={() => false} className="relative flex flex-1" action={urls.app.explore.path} method="GET">*/}
                            {/*    <label htmlFor="search-field" className="sr-only">*/}
                            {/*        Search*/}
                            {/*    </label>*/}
                            {/*    <MagnifyingGlassIcon*/}
                            {/*        className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"*/}
                            {/*        aria-hidden="true"*/}
                            {/*    />*/}
                            {/*    <input*/}
                            {/*        id="search-field"*/}
                            {/*        className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 text-sm lg:text-md"*/}
                            {/*        placeholder="Search..."*/}
                            {/*        type="search"*/}
                            {/*        name="search"*/}
                            {/*    />*/}
                            {/*</Form>*/}
                            <MusicPlayer />
                            <div className="flex items-center gap-x-4 lg:gap-x-6">
                                <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                                    <span className="sr-only">View notifications</span>
                                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                                </button>

                                {/* Separator */}
                                <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

                                {/* Profile dropdown */}
                                <Menu as="div" className="relative">
                                    <Menu.Button className="-m-1.5 flex items-center p-1.5">
                                        <span className="sr-only">Open user menu</span>
                                        {
                                            user ? (
                                                <img
                                                    className="h-8 w-8 rounded-full bg-gray-50"
                                                    src={`https://picsum.photos/id/${parseInt(user._id.substring(user._id.length-4), 16) % 320}/64`}
                                                    alt="profile picture"
                                                />
                                            ) : (
                                                <UserIcon className="h-8 w-8 rounded-full bg-gray-50 text-gray-100"/>
                                            )
                                        }

                                        <span className="hidden lg:flex lg:items-center">
                                            <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                                                {user ? user.username : "Guest"}
                                            </span>
                                            <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                                        </span>
                                    </Menu.Button>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                            {userNavigation.map((item) => (
                                                <Menu.Item key={item.name}>
                                                    {({ active }) => (
                                                        <Link
                                                            to={item.href || ""}
                                                            onClick={"onClick" in item ? item.onClick : undefined}
                                                            className={classNames(
                                                                active ? 'bg-gray-50' : '',
                                                                'block px-3 py-1 text-sm leading-6 text-gray-900'
                                                            )}
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    )}
                                                </Menu.Item>
                                            ))}
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </div>

                    <main className="py-8">
                        <div className="px-4 sm:px-6 lg:px-8">
                            <Routes urls={pages} />
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
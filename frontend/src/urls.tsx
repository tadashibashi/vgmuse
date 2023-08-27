import LogInPage from "./pages/auth/LogInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import React from "react";
import LandingPage from "./pages/LandingPage.tsx";
import ValidationEmailSentPage from "./pages/auth/ValidationEmailSentPage.tsx";
import AuthPages from "./pages/auth/AuthPages.tsx";
import ValidationReceivedPage from "./pages/auth/ValidationReceivedPage.tsx";
import AppPages from "./pages/app/AppPages.tsx";
import UploadTrackPage from "./pages/app/UploadTrackPage.tsx";

export type URLDirectory = Record<string, URLInfo>;

export interface URLInfo {
    path: string;
    page: React.JSX.Element;
}

export const urls = {
    root: {
        landingPage: {
            path: "/",
            page: <LandingPage />
        } as URLInfo,
        auth: {
            path: "/auth/*",
            page: <AuthPages />
        } as URLInfo,
        app: {
            path: "/app/*",
            page: <AppPages />
        } as URLInfo,
    },

    app: {
        index: {
            path: "/app",
            page: <AppPages />
        },
        explore: {
            path: "/app/explore",
            page: <h1>Explore</h1>,
        },
        myTracks: {
            path: "/app/my-tracks",
            page: <h1>My Tracks</h1>,
        },
        uploadTrack: {
            path: "/app/upload-track",
            page: <UploadTrackPage />,
        },
        stats: {
            path: "/app/stats",
            page: <></>,
        },
    },

    auth: {
        index: {
            path: "/auth",
            page: <></>
        },
        userLogin: {
            path: "/auth/login",
            page: <LogInPage />
        } as URLInfo,
        userSignUp: {
            path: "/auth/signup",
            page: <SignUpPage />
        } as URLInfo,
        validationEmailSent: {
            path: "/auth/email-sent",
            page: <ValidationEmailSentPage />
        } as URLInfo,
        validationReceived: {
            path: "/auth/activate",
            page: <ValidationReceivedPage />
        } as URLInfo,
    },
};

export default urls;

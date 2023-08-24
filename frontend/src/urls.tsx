import LogInPage from "./pages/auth/LogInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import React from "react";
import LandingPage from "./pages/LandingPage.tsx";
import ValidationEmailSentPage from "./pages/auth/ValidationEmailSentPage.tsx";
import AuthPages from "./pages/auth/AuthPages.tsx";
import ValidationReceivedPage from "./pages/auth/ValidationReceivedPage.tsx";

export interface URLDirectory {
    [key: string]: URLInfo
}

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
        } as URLInfo
    },

    auth: {
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

import LogInPage from "./pages/auth/LogInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import React from "react";
import LandingPage from "./pages/LandingPage.tsx";

export interface URLDirectory {
    [key: string]: URLInfo
}

export interface URLInfo {
    path: string;
    page: React.JSX.Element;
}

const urls = {
    userLogin: {
        path: "/auth/login",
        page: <LogInPage />
    } as URLInfo,

    userSignUp: {
        path: "/auth/signup",
        page: <SignUpPage />
    } as URLInfo,

    landingPage: {
        path: "/",
        page: <LandingPage />
    } as URLInfo,
};

export default urls;
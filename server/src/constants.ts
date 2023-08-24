import {getEnv} from "./lib/env";

export const PORT = getEnv("PORT") || 3000;

export const DOMAIN = getEnv("DOMAIN") || "localhost";

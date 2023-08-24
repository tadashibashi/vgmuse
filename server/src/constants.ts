import {getEnv} from "./lib/env";

export const PORT = getEnv("PORT") || 3000;
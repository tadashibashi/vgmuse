/// <reference types="vite/client" />

declare const Module: EmscriptenModule & {cwrap: typeof cwrap, ccall: typeof ccall};
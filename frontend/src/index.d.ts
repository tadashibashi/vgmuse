import React from "react";

declare global {
    export namespace VGMuse {

        type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;

    }
}
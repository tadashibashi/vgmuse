
//
// export default function JWTokenClass<T extends object|Buffer>(validator: (token: unknown) => token is T) {
//     class JWToken {
//
//         private _tok: string;
//
//         constructor(token: string) {
//             this._tok = token;
//         }
//
//         /**
//          * @param payload - the object to store
//          * @param expiresIn - time until expiration - string in ms format
//          *                    (e.g. https://github.com/vercel/ms)
//          */
//         static create(payload: T, expiresIn: string);
//         /**
//          * @param payload - the object to store
//          * @param expiresInSeconds number in SECONDS until token will expire
//          */
//         static create(payload: T, expiresInSeconds: number);
//         static create(payload: T, expiresIn: string|number): JWToken {
//             return new JWToken(createToken(payload, expiresIn));
//         }
//
//         get token() {
//             return this._tok;
//         }
//
//         parse(): T {
//
//         }
//
//
//
//
//     }
//
// }


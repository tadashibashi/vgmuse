import bcrypt from "bcrypt"

const SALT_ROUNDS = 7;

export async function hash(str: string) {
    return bcrypt.hash(str.trim(), SALT_ROUNDS);
}

export async function hashCompare(str: string, hash: string) {
    return bcrypt.compare(str.trim(), hash);
}

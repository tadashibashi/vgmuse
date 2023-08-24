import {hash} from "bcrypt";
import {createToken} from "../jwt";
import {hashCompare} from "../hash";
import {HydratedDocument} from "mongoose";
import {sendEmail} from "../../api/email";
import {reqEnv} from "../env";
import {DOMAIN, PORT} from "../../constants";


const SALT_ROUNDS = 8;


async function genUserVerificationToken(userId: string, username: string) {
    const obj = {
        user: {
            id: await hash(userId, SALT_ROUNDS),
            name: username,
        }
    };

    return createToken(obj, "15m");
}

function compareUserVerificationToken(userId: string, encrypted: string) {
    return hashCompare(userId, encrypted);
}

export async function sendVerificationEmail(user: VGMuse.Frontend.User | HydratedDocument<VGMuse.IUser>) {

    const token = await genUserVerificationToken(user._id.toString(), user.username);
    let link: string;
    let subpath = `auth/activate?token=${token}`;
    if (DOMAIN === "localhost")
        link = `http://localhost:${PORT}/${subpath}`;
    else
        link = `${DOMAIN}/${subpath}`;


    const MaxLinkLength = 48;

    // send email
    return sendEmail(user.email, reqEnv("EMAIL_SENDER"), "Activate your VGMuse Account",

        `<p>Hello,</p>
<p>Thank you for registering your account at VGMuse! 
Please click the link below to activate your account.<p>

<a href="${link}">${link.substring(0, MaxLinkLength) + (link.length > MaxLinkLength ? "..." : "")}</a>

<p>We hope you enjoy your new chiptune music space!</p>

<p>Best regards,</p>
<p>The VGMuse Team</p>
`);
}

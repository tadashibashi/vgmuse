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


export async function sendPasswordResetEmail(user: VGMuse.Frontend.User | HydratedDocument<VGMuse.IUser>) {
    const token = await genUserVerificationToken(user._id.toString(), user.username);
    let link: string;
    let subpath = `auth/reset-password?token=${token}`;
    if (DOMAIN === "localhost")
        link = `http://localhost:${PORT}/${subpath}`;
    else
        link = `https://${DOMAIN}/${subpath}`;

    const MaxLinkLength = 48;

    return sendEmail(user.email, reqEnv("EMAIL_SENDER"), "Password Reset your VGMuse Account",
`
<p>Hello {user.username},</p>
<p>We sent this message to you because you requested a password reset for your VGMuse Account.</p>

<p>To reset your password, please click the link below within the next 15 minutes: </p>
<a href="${link}">${link.substring(0, MaxLinkLength) + (link.length > MaxLinkLength ? "..." : "")}</a>

<p>Best Regards,</p>
<p>The VGMuse Team</p>
`);
}

export async function sendVerificationEmail(user: VGMuse.Frontend.User | HydratedDocument<VGMuse.IUser>) {

    const token = await genUserVerificationToken(user._id.toString(), user.username);
    let link: string;
    let subpath = `auth/activate?token=${token}`;
    if (DOMAIN === "localhost")
        link = `http://localhost:${PORT}/${subpath}`;
    else
        link = `https://${DOMAIN}/${subpath}`;


    const MaxLinkLength = 48;

    // send email
    return sendEmail(user.email, reqEnv("EMAIL_SENDER"), "Activate your VGMuse Account",

`
<p>Hello,</p>
<p>Thank you for registering your account at VGMuse! 
Please click the link below within the next 15 minutes to activate your account.<p>

<a href="${link}">${link.substring(0, MaxLinkLength) + (link.length > MaxLinkLength ? "..." : "")}</a>

<p>We hope you enjoy your new chiptune music space!</p>

<p>Best regards,</p>
<p>The VGMuse Team</p>
`);
}

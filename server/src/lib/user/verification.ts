import {hash} from "bcrypt";
import {createToken} from "../jwt";
import {hashCompare} from "../hash";
import {HydratedDocument} from "mongoose";
import {sendEmail} from "../../api/email";
import {reqEnv} from "../env";


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

    const verificationToken = await genUserVerificationToken(user._id.toString(), user.username);


    // send email
    return sendEmail(user.email, reqEnv("EMAIL_SENDER"), "Activate your VGMuse Account",

        `<p>Hello,</p>
<p>Thank you for registering your account at VGMuse! 
Please click the link below to activate your account.<p>

<a href="http://localhost:5173/auth/activate?token=${verificationToken}">http://localhost:5173/auth/activate/${verificationToken}</a>

<p>We hope you enjoy your new chiptune music space!</p>

<p>Best regards,</p>
<p>The VGMuse Team</p>
`);
}

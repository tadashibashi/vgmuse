import sendgrid from "@sendgrid/mail";
import {reqEnv} from "../utilities/env";

sendgrid.setApiKey(reqEnv("SENDGRID_API_KEY"))

export async function sendMail(to: string, from: string, subject: string, html: string) {
    return sendgrid.send({
        to, from, subject, html});
}

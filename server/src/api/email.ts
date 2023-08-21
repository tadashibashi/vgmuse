import sendgrid from "@sendgrid/mail";

export async function sendEmail(to: string, from: string, subject: string, html: string) {
    return sendgrid.send({
        to, from, subject, html});
}

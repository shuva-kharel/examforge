import nodemailer from "nodemailer";
import { config } from "../config/app.config";

type Params = {
    to: string | string[];
    subject: string;
    text: string;
    html: string;
    from?: string;
};

// Choose sender based on environment
const mailer_sender =
    config.NODE_ENV === "development"
        ? config.SMTP_USER        // send dev emails to yourself
        : config.MAILER_SENDER;   // production verified sender

// Create Nodemailer transport
const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: Number(config.SMTP_PORT),
    secure: config.SMTP_PORT === "465", // true for 465, false for 587
    auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS,
    },
});

export const sendEmail = async ({
    to,
    from = mailer_sender,
    subject,
    text,
    html,
}: Params) => {
    try {
        const info = await transporter.sendMail({
            from,
            to: Array.isArray(to) ? to.join(", ") : to, // comma-separated
            subject,
            text,
            html,
        });
        console.log("Email sent:", info.messageId);
        return info;
    } catch (err: any) {
        console.error("Nodemailer error:", err.message);
        throw err;
    }
};

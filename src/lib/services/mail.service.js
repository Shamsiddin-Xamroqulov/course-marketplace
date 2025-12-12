import nodemailer from "nodemailer";
import serverConfig from "../../config.js"
const {mail_service: {EMAIL, NODE_MAILER_KEY}} = serverConfig;

const mailService = async (otp, email) => {
    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: EMAIL,
            pass: NODE_MAILER_KEY
        },
    });
    await transport.sendMail({
        from: EMAIL,
        to: email,
        subject: `Library email verify`,
        text: `OTP ${otp}`
    });
};

export default mailService;
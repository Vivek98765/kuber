require("dotenv").config();
const nodemailer = require("nodemailer");
const config = require("../config/auth.config");

const user = config.user;
const pass = config.pass;

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: user,
                pass: pass,
            },
        });

        await transporter.sendMail({
            from: user,
            to: email,
            subject: subject,
            html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+text+">Click here to verify</a>",
        });

        console.log("Email sent sucessfully");
    } catch (error) {
        console.log(error, "Email not sent");
    }
};

module.exports = sendEmail;
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });;

      await transporter.sendMail({
        from: process.env.EMAIL_USER, // ✅ safer than hardcoding
        to: email,
        subject,
        text,
      });
      

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email not sent:", error);
    throw error;
  }
};

module.exports = sendEmail;

const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    console.log("Creating transporter with:", process.env.EMAIL_USER);
    
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("Sending email to:", to);
    
    const info = await transporter.sendMail({
      from: `"Todo App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: `<p>${text.replace(/\n/g, "<br>")}</p>`, // Add HTML version
    });

    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Rethrow to handle in the route
  }
};

module.exports = sendEmail;
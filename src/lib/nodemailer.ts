import nodemailer from "nodemailer";

export interface TransportOptions {
  service: string;
  host?: string;
  port?: number;
  secure?: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export default function sender() {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "dagonparinya@gmail.com",
      pass: "",
    },
  });

  const mailConfiguration = {
    from: "noreply@gmail.com",
    to: "parinyadragon34@gmail.com",
    subject: "Email Verification",

    // This would be the text of email body
    text: `Hi! There, You have recently visited 
           our website and entered your email.
           Please follow the given link to verify your email
           http://localhost:5000/verify/ 
           Thanks`,
  };

  transporter.sendMail(mailConfiguration, (error, info) => {
    if (error) throw error;
    console.log("Email Sent Successfully", info);
  });
}

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

export default function sender(
  code: string = "F23VGG",
  email: string = "parinyadragon34@gmail.com"
) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "dagonparinya@gmail.com",
      pass: "pqrqxlnjzpagqysg",
    },
  });

  const mailConfiguration = {
    from: "noreply@gmail.com",
    to: email,
    subject: "รายละเอียดการเข้าร่วมกิจกรรม",

    html: `
    <div>
      <div>
        <h3>ใช้รหัสนี้ในการเข้าร่วมกิจกรรม</h3>
      </div>
      <div>
        <h1>${code}</h1>
      </div>
    </div>
    `,
  };

  transporter.sendMail(mailConfiguration, (error, info) => {
    if (error) throw error;
  });
}

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // app password recommended
  },
});

export async function sendOtpEmail(toEmail, code) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: `Your OTP code`,
    text: `Your OTP code is: ${code}. It will expire in 5 minutes.`,
    html: `<p>Your OTP code is: <b>${code}</b></p><p>It will expire in 5 minutes.</p>`,
  };

  return transporter.sendMail(mailOptions);
}

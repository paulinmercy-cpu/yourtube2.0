import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

try {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: "paulinmercy@karunya.edu.in",
    subject: "Test Mail",
    text: "Hello from Nodemailer!",
  });

  console.log(info);
} catch (err) {
  console.error(err);
}
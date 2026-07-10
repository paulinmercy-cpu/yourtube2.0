import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendInvoice = async (email, name, plan) => {
  const amount =
    plan === "Bronze"
      ? "₹10"
      : plan === "Silver"
      ? "₹50"
      : "₹100";

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "YourTube Premium Invoice",

    html: `
      <h2>Payment Successful</h2>

      <p>Hello <b>${name}</b>,</p>

      <p>Thank you for upgrading your plan.</p>

      <hr/>

      <h3>Invoice</h3>

      <p><b>Plan:</b> ${plan}</p>
      <p><b>Amount:</b> ${amount}</p>

      <hr/>

      <p>Enjoy premium watching!</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
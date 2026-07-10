import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";

export const generateOTP = () => {
  return otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
    digits: true,
  });
};

export const sendEmailOTP = async (email, otp) => {
  try {
    console.log("============== EMAIL OTP ==============");
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log(
      "EMAIL_PASS:",
      process.env.EMAIL_PASS ? "Loaded" : "Not Loaded"
    );
    console.log("Sending OTP to:", email);
    console.log("OTP:", otp);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify SMTP connection
    await transporter.verify();
    console.log("SMTP Server Connected Successfully");

    const info = await transporter.sendMail({
      from: `"YourTube" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "YourTube Login OTP",
      text: `Your OTP is ${otp}. This OTP is valid for 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding:20px">
          <h2>YourTube Login OTP</h2>
          <p>Your One-Time Password is:</p>

          <h1 style="
            color:#2563eb;
            letter-spacing:5px;
            font-size:36px;
          ">
            ${otp}
          </h1>

          <p>This OTP is valid for <b>5 minutes</b>.</p>

          <p>If you didn't request this OTP, please ignore this email.</p>
        </div>
      `,
    });

    console.log("Email sent successfully");
    console.log("Message ID:", info.messageId);
    console.log("Response:", info.response);
    console.log("=======================================");
  } catch (error) {
    console.error("EMAIL SEND ERROR");
    console.error(error);
    throw error;
  }
};

export const sendMobileOTP = async (phone, otp) => {
  console.log("============== MOBILE OTP ==============");
  console.log(`Phone: ${phone}`);
  console.log(`OTP: ${otp}`);

  // Replace this with Twilio later
  console.log("SMS OTP sent successfully (Mock)");
  console.log("========================================");
};
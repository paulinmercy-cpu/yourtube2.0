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
    console.log("========== EMAIL OTP ==========");
    console.log("To:", email);
    console.log("OTP:", otp);
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error(
        "EMAIL_USER or EMAIL_PASS environment variable is missing."
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    const info = await transporter.sendMail({
      from: `"YourTube" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "YourTube Login OTP",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
      html: `
        <div style="font-family:Arial,sans-serif">
          <h2>YourTube Login OTP</h2>
          <p>Your OTP is:</p>
          <h1>${otp}</h1>
          <p>This OTP is valid for 5 minutes.</p>
        </div>
      `,
    });

    console.log("Email Sent");
    console.log(info.messageId);

    return true;
  } catch (error) {
    console.error("Email Error:", error.message);
    throw error;
  }
};

export const sendMobileOTP = async (phone, otp) => {
  console.log("========== MOBILE OTP ==========");
  console.log("Phone:", phone);
  console.log("OTP:", otp);

  // Mock SMS
  return true;
};
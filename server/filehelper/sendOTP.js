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

// ================= EMAIL OTP =================
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
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000,
    });

    const info = await transporter.sendMail({
      from: `"YourTube" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "YourTube Login OTP",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px">
          <h2>YourTube Login OTP</h2>

          <p>Your OTP is:</p>

          <h1 style="color:#2563eb;letter-spacing:4px;">
            ${otp}
          </h1>

          <p>This OTP is valid for <b>5 minutes</b>.</p>
        </div>
      `,
    });

    console.log("Email sent successfully");
    console.log(info.messageId);

    return true;
  } catch (error) {
    console.error("Email Error:", error.message);
    throw error;
  }
};

// ================= MOBILE OTP =================
export const sendMobileOTP = async (phone, otp) => {
  console.log("========== MOBILE OTP ==========");
  console.log("Phone:", phone);
  console.log("OTP:", otp);

  // Mock SMS
  return true;
};
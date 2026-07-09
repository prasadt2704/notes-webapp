import "server-only";
import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";

type EmailData = {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
};

export async function sendEmail({
  email,
  userId,
  emailType,
}: EmailData) {
  try {
    // Hash token string for DB storage and email link.
    const hashed = await bcrypt.hash(String(userId), 10);

    if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashed,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verificationToken: hashed,
        verificationTokenExpiry: Date.now() + 3600000,
      });
    }

    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT || 587),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const actionPath = emailType === "VERIFY" ? "verifyemail" : "resetpassword";

    const actionText = emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password";
    const actionButtonText = emailType === "VERIFY" ? "Verify Email" : "Reset Password";
    const actionDescription = emailType === "VERIFY" 
      ? "Thank you for signing up! Please verify your email address to activate your account and start creating content scripts." 
      : "We received a request to reset your password. Click the button below to set a new password.";

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: emailType === "VERIFY" ? "Verify your account - Scripta" : "Reset your password - Scripta",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 10px; text-align: center;">${actionText}</h2>
            <p style="color: #666; text-align: center; margin-bottom: 5px; font-size: 14px;">Scripta</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Hello,
            </p>
            
            <p style="color: #555; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">
              ${actionDescription}
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.DOMAIN}/${actionPath}?token=${hashed}" 
                 style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; font-weight: bold; font-size: 16px;">
                ${actionButtonText}
              </a>
            </div>
            
            <p style="color: #999; font-size: 13px; text-align: center; margin-top: 25px;">
              Or copy and paste this link in your browser:
            </p>
            <p style="color: #0066cc; font-size: 12px; text-align: center; word-break: break-all; margin: 10px 0;">
              ${process.env.DOMAIN}/${actionPath}?token=${hashed}
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
            
            <p style="color: #999; font-size: 12px; line-height: 1.5; margin-bottom: 10px;">
              This link will expire in 1 hour for security reasons.
            </p>
            <p style="color: #999; font-size: 12px; line-height: 1.5; margin-bottom: 10px;">
              ${emailType === "VERIFY" 
                ? "If you didn't create this account, please ignore this email." 
                : "If you didn't request a password reset, please ignore this email."}
            </p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                © 2026 Scripta. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    console.log("Error sending email: ", error);
    throw error;
  }
}

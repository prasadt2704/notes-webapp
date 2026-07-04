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
      port: 2525,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const actionPath = emailType === "VERIFY" ? "verifyemail" : "resetpassword";

    const mailOptions = {
      from: "prasad@gmail.com",
      to: email,
      subject: emailType === "VERIFY" ? "Verify your account" : "Reset your password",
      html: `<p>Click <a href="${process.env.DOMAIN}/users/${actionPath}?token=${hashed}">here</a> to ${emailType === "VERIFY" ? "verify your account" : "reset your password"}</p>`,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    console.log("Error sending email: ", error);
  }
}

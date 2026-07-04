import { connect } from "../../../../dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "No user found with this email" }, { status: 404 });
    }

    await sendEmail({
      email,
      userId: String(user._id),
      emailType: "RESET",
    });

    return NextResponse.json(
      { message: "Password reset email sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error handling forgot password:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

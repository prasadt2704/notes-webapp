import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST (req: NextRequest) {
  try {
    const { newPassword, token } = await req.json();


    const user = await User.findOne({ forgotPasswordToken: token });
    if (!user) {
      return NextResponse.json({ error: 'Unable to complete this process try again'}, { status: 400});
    }

   //hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    user.password = hashedPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({ data: 'Password reset successfully'}, { status: 200})

  } catch (error) {
    return NextResponse.json({ error: `Internal Server Error: ${error}`}, { status: 500})
  }
}
import {connect} from "../../../../dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    //create token and send it to the client
    const tokenData = {
      id: user._id,
      email: user.email,
      username: user.username
    };

    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d" });

    const response = NextResponse.json({ message: "Login successful" }, { status: 200 });
    response.cookies.set("token", token, { httpOnly: true });
    return response;
  } catch (error) {
    console.error("Error during user login:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
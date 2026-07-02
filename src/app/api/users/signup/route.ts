import { connect } from "../../../../dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

connect();
export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    //hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);



    //Create a new user
    const newUser = new User({ username, email, password: hashedPassword });
    const data = await newUser.save();
    console.log("User created successfully:", data);

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error during user signup:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

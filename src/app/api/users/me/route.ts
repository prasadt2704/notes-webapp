import { connect } from "../../../../dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connect();

type TokenPayload = {
  id: string;
  email: string;
  username: string;
};

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as TokenPayload;
    const user = await User.findById(decoded.id).select("username email");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

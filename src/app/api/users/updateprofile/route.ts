import { connect } from "../../../../dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { getTokenPayload } from "@/helpers/auth";
import bcryptjs from "bcryptjs";

connect();

export async function PUT(req: NextRequest) {
  try {
    const payload = getTokenPayload(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username, oldPassword, newPassword } = await req.json();

    const user = await User.findById(payload.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If trying to update password
    if (oldPassword && newPassword) {
      // Verify old password
      const isPasswordValid = await bcryptjs.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json({ error: "Old password is incorrect" }, { status: 401 });
      }

      // Check if new password is same as old password
      if (oldPassword === newPassword) {
        return NextResponse.json(
          { error: "New password must be different from old password" },
          { status: 400 }
        );
      }

      // Hash and update new password
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(newPassword, salt);
      user.password = hashedPassword;
    }

    // Update username if provided
    if (username && username !== user.username) {
      // Check if username already exists
      const existingUser = await User.findOne({ username, _id: { $ne: user._id } });
      if (existingUser) {
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 400 }
        );
      }
      user.username = username;
    }

    await user.save();
    return NextResponse.json(
      { message: "Profile updated successfully", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

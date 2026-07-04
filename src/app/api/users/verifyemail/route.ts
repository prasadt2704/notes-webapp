import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    const user = await User.findOne({verificationToken: token.toString(), verificationTokenExpiry: { $gt: Date.now() }})

    if(!user) {
      return NextResponse.json({ error : 'Invalid token'}, { status: 400 });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({ data: 'Email verified successfully'}, { status: 200});
  } catch (error) {
    return NextResponse.json({ error: `Internal Server Error: ${error}`}, { status: 500})
  }
}
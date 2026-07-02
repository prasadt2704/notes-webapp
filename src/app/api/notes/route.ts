import { connect} from "../../../dbConfig/dbConfig";
import Note from "@/models/noteModel";
import { NextRequest, NextResponse } from "next/server";
import { getTokenPayload } from "@/lib/auth";

connect();

export async function GET(req: NextRequest) {
  try {
    const payload = getTokenPayload(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const noteId = req.nextUrl.searchParams.get("id");

    if (noteId) {
      const note = await Note.findById({ _id: noteId, userId: payload.id });
      if (!note) {
        return NextResponse.json({ error: "No data available" }, { status: 404 });
      }

      return NextResponse.json(note, { status: 200 });
    }

    const notes = await Note.find({ userId: payload.id }).sort({ createdAt: -1 });

    return NextResponse.json(notes, { status: 200});

  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const payload = getTokenPayload(req);
    if (!payload) {
      return NextResponse.json({error: 'Unauthorised'}, { status: 401});
    }

    const { id, title, content, userId } = await req.json();
    const note = new Note({ id, title, content, userId});
    await note.save();

    return NextResponse.json({ message: "Note created successfully" }, { status: 201 })
  } catch (error) {
    console.error('Error creating notes', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 


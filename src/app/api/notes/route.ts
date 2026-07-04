import { connect} from "../../../dbConfig/dbConfig";
import Note from "@/models/noteModel";
import { NextRequest, NextResponse } from "next/server";
import { getTokenPayload } from "@/helpers/auth";

connect();

export async function GET(req: NextRequest) {
  try {
    const payload = getTokenPayload(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const noteId = req.nextUrl.searchParams.get("id");

    if (noteId) {
      const note = await Note.findById({ id: noteId, userId: payload.id });
      if (!note) {
        return NextResponse.json({ error: "No data available" }, { status: 404 });
      }

      return NextResponse.json(note, { status: 200 });
    }

    const searchText = req.nextUrl.searchParams.get("search")?.trim();

    if (searchText) {
      const escapedSearchText = searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = new RegExp(escapedSearchText, "i");

      const notes = await Note.find({
        userId: payload.id,
        $or: [{ title: searchRegex }, { content: searchRegex }],
      }).sort({ createdAt: -1 });

      return NextResponse.json(notes, { status: 200 });
    }


    const notes = await Note.find({ userId: payload.id }).sort({ createdAt: -1 });

    return NextResponse.json(notes, { status: 200});

  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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

export async function PUT (req: NextRequest) {
  try { 
    const payload = getTokenPayload(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const id = body?.id ?? req.nextUrl.searchParams.get("id");
    const title = body?.title;
    const content = body?.content;

    if (!id) {
      return NextResponse.json({ error: "Note id is required" }, { status: 400 });
    }

    const updates: { title?: string | number; content?: string } = { title, content};

    const note = await Note.findOneAndUpdate(
      { id: id, userId: payload.id },
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(note, { status: 200 });

  } catch (error) {
    console.error('Error updating notes', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }

}

export async function DELETE (req: NextRequest) {
  try {
    const payload = getTokenPayload(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const id = body?.id ?? req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Note id is required" }, { status: 400 });
    }

    const deletedNote = await Note.findOneAndDelete({ id: id, userId: payload.id });

    if (!deletedNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Note deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error('Error deleting notes', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


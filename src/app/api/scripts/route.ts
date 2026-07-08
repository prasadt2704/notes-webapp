import { connect } from "../../../dbConfig/dbConfig";
import Script from "@/models/scriptModel";
import { NextRequest, NextResponse } from "next/server";
import { getTokenPayload } from "@/helpers/auth";

connect();

export async function GET(req: NextRequest) {
  try {
    const payload = getTokenPayload(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const scriptId = req.nextUrl.searchParams.get("id");

    if (scriptId) {
      const script = await Script.findOne({ id: scriptId, userId: payload.id });
      if (!script) {
        return NextResponse.json({ error: "No data available" }, { status: 404 });
      }

      return NextResponse.json(script, { status: 200 });
    }

    const searchText = req.nextUrl.searchParams.get("search")?.trim();

    if (searchText) {
      const escapedSearchText = searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = new RegExp(escapedSearchText, "i");

      const scripts = await Script.find({
        userId: payload.id,
        $or: [{ title: searchRegex }, { content: searchRegex }, { hook: searchRegex }, {status: searchRegex}],
      }).sort({ createdAt: -1 });

      return NextResponse.json(scripts, { status: 200 });
    }

    const scripts = await Script.find({ userId: payload.id }).sort({ createdAt: -1 });

    return NextResponse.json(scripts, { status: 200 });
  } catch (error) {
    console.error("Error fetching scripts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = getTokenPayload(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, title, hook, content, cta, status, instagramLink, locations, userId } = await req.json();
    const script = new Script({
      id,
      title,
      hook,
      content,
      cta,
      status,
      instagramLink,
      locations,
      userId,
    });
    await script.save();

    return NextResponse.json({ message: "Script created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating script:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const payload = getTokenPayload(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const id = body?.id ?? req.nextUrl.searchParams.get("id");
    const title = body?.title;
    const hook = body?.hook;
    const content = body?.content;
    const cta = body?.cta;
    const status = body?.status;
    const instagramLink = body?.instagramLink;
    const locations = body?.locations;

    if (!id) {
      return NextResponse.json({ error: "Script id is required" }, { status: 400 });
    }

    const updates: { title?: string; hook?: string; content?: string; cta?: string; status?: string; instagramLink?: string; locations?: string[] } = {};
    if (title !== undefined) updates.title = title;
    if (hook !== undefined) updates.hook = hook;
    if (content !== undefined) updates.content = content;
    if (cta !== undefined) updates.cta = cta;
    if (status !== undefined) updates.status = status;
    if (instagramLink !== undefined) updates.instagramLink = instagramLink;
    if (locations !== undefined) updates.locations = locations;

    const script = await Script.findOneAndUpdate(
      { id: id, userId: payload.id },
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!script) {
      return NextResponse.json({ error: "Script not found" }, { status: 404 });
    }

    return NextResponse.json(script, { status: 200 });
  } catch (error) {
    console.error("Error updating script:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const payload = getTokenPayload(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const id = body?.id ?? req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Script id is required" }, { status: 400 });
    }

    const deletedScript = await Script.findOneAndDelete({ id: id, userId: payload.id });

    if (!deletedScript) {
      return NextResponse.json({ error: "Script not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Script deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting script:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

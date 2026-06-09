import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { auth } from "@/auth";
import { SiteContent, DEFAULT_SITE_CONTENT } from "@/models/SiteContent";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectToDatabase();

  const content = await SiteContent.findOne({ key: "singleton" }).lean();

  return NextResponse.json({ content: content ?? DEFAULT_SITE_CONTENT });
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" && value !== null && !Array.isArray(value)
  );
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!isPlainObject(body)) {
    return NextResponse.json(
      { error: "Body must be an object." },
      { status: 400 }
    );
  }

  // The key is fixed for the singleton; never let the client overwrite it.
  const { key: _key, _id, createdAt, updatedAt, ...update } = body;
  void _key;
  void _id;
  void createdAt;
  void updatedAt;

  try {
    await connectToDatabase();

    const updated = await SiteContent.findOneAndUpdate(
      { key: "singleton" },
      { $set: update },
      { new: true, upsert: true }
    ).lean();

    return NextResponse.json({ content: updated });
  } catch (error) {
    console.error("Failed to update site content:", error);
    return NextResponse.json(
      { error: "Failed to update site content." },
      { status: 500 }
    );
  }
}

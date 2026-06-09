import { NextResponse, type NextRequest } from "next/server";
import sharp from "sharp";
import { connectToDatabase } from "@/lib/mongodb";
import { auth } from "@/auth";
import { MediaAsset, MEDIA_SLOTS } from "@/models/MediaAsset";

export const dynamic = "force-dynamic";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const SLOT_KEYS = new Set<string>(MEDIA_SLOTS.map((s) => s.key));

export async function GET() {
  await connectToDatabase();

  const assets = await MediaAsset.find().lean();

  const bySlot: Record<string, (typeof assets)[number]> = {};
  for (const asset of assets) {
    bySlot[asset.slot] = asset;
  }

  return NextResponse.json({ media: bySlot });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const slot = form.get("slot");
    const file = form.get("file");

    if (typeof slot !== "string" || !SLOT_KEYS.has(slot)) {
      return NextResponse.json({ error: "Invalid slot." }, { status: 400 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, or WebP images are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Image must be 5MB or smaller." },
        { status: 400 }
      );
    }

    const inputBuffer = Buffer.from(await file.arrayBuffer());

    const outputBuffer = await sharp(inputBuffer)
      .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 75 })
      .toBuffer();

    const url = `data:image/jpeg;base64,${outputBuffer.toString("base64")}`;
    const filename = file.name;
    const size = outputBuffer.length;

    await connectToDatabase();

    await MediaAsset.findOneAndUpdate(
      { slot },
      { $set: { url, filename, size } },
      { new: true, upsert: true }
    );

    return NextResponse.json({ ok: true, slot, url, filename, size });
  } catch (error) {
    console.error("Failed to upload media asset:", error);
    return NextResponse.json(
      { error: "Failed to upload media asset." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const slot = request.nextUrl.searchParams.get("slot");
  if (!slot) {
    return NextResponse.json({ error: "Slot is required." }, { status: 400 });
  }

  try {
    await connectToDatabase();
    await MediaAsset.deleteOne({ slot });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete media asset:", error);
    return NextResponse.json(
      { error: "Failed to delete media asset." },
      { status: 500 }
    );
  }
}

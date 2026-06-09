import { NextResponse, type NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import {
  APPLICATION_STATUSES,
  Application,
  type ApplicationStatus,
} from "@/models/Application";

export const dynamic = "force-dynamic";

function isApplicationStatus(value: unknown): value is ApplicationStatus {
  return (
    typeof value === "string" &&
    (APPLICATION_STATUSES as readonly string[]).includes(value)
  );
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Invalid application id." },
      { status: 400 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const status =
    body && typeof body === "object" && "status" in body
      ? (body as { status?: unknown }).status
      : undefined;

  if (!isApplicationStatus(status)) {
    return NextResponse.json(
      {
        error: `Status must be one of: ${APPLICATION_STATUSES.join(", ")}.`,
      },
      { status: 400 }
    );
  }

  await connectToDatabase();

  const updated = await Application.findByIdAndUpdate(
    id,
    { $set: { status } },
    { new: true }
  ).lean();

  if (!updated) {
    return NextResponse.json(
      { error: "Application not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ application: updated });
}

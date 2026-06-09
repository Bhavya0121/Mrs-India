import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Application from "@/models/Application";

const STRING_FIELDS = [
  "full_name",
  "dob",
  "email",
  "phone",
] as const;

type StringField = (typeof STRING_FIELDS)[number];
type ApplicationInput = Partial<Record<StringField, unknown>> & {
  fee_amount?: unknown;
  payment_status?: unknown;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GENERIC_ERROR = "Could not submit application. Please try again.";

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidPhone(value: string): boolean {
  if (!/^\+?[\d\s\-()]+$/.test(value)) return false;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

function generateReference(): string {
  const digits = Math.floor(100000 + Math.random() * 900000);
  return `RQ-2026-${digits}`;
}

export async function POST(request: Request) {
  let body: ApplicationInput;
  try {
    body = (await request.json()) as ApplicationInput;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  for (const field of STRING_FIELDS) {
    const value = asString(body[field]);
    if (value) data[field] = value;
  }

  if (!data.full_name || !data.email || !data.phone) {
    return NextResponse.json(
      { error: "Name, email, and phone are required." },
      { status: 400 },
    );
  }

  if (!EMAIL_REGEX.test(data.email as string)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  if (!isValidPhone(data.phone as string)) {
    return NextResponse.json(
      { error: "Please provide a valid phone number." },
      { status: 400 },
    );
  }

  if (typeof body.fee_amount === "number") {
    data.fee_amount = body.fee_amount;
  }
  if (typeof body.payment_status === "string") {
    data.payment_status = body.payment_status;
  }

  try {
    await connectToDatabase();
  } catch (error) {
    console.error("[applications] DB connection failed:", error);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const saved = await Application.create({
        ...data,
        reference: generateReference(),
      });
      return NextResponse.json(saved.toObject(), { status: 201 });
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        (error as { code?: number }).code === 11000 &&
        attempt < 4
      ) {
        continue;
      }
      console.error("[applications] create failed:", error);
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
    }
  }

  console.error("[applications] reference collision after 5 attempts");
  return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
}

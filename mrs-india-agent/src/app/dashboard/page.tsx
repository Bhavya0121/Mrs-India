import { connectToDatabase } from "@/lib/mongodb";
import { Application } from "@/models/Application";
import { auth } from "@/auth";
import type { SerializedApplication } from "@/types/application";
import { DashboardShell } from "./dashboard-shell";

export const dynamic = "force-dynamic";

async function getApplications(): Promise<SerializedApplication[]> {
  await connectToDatabase();

  const docs = await Application.find({})
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  return docs.map((d) => {
    const { _id, createdAt, updatedAt, ...rest } = d as Record<
      string,
      unknown
    > & {
      _id: unknown;
      createdAt?: Date;
      updatedAt?: Date;
    };
    return {
      ...(rest as Omit<
        SerializedApplication,
        "_id" | "createdAt" | "updatedAt" | "status"
      >),
      _id: String(_id),
      status: ((rest as { status?: string }).status ??
        "pending") as SerializedApplication["status"],
      createdAt: (createdAt ?? new Date()).toISOString(),
      updatedAt: (updatedAt ?? new Date()).toISOString(),
    };
  });
}

export default async function DashboardPage() {
  const [session, applications] = await Promise.all([
    auth(),
    getApplications(),
  ]);
  const agentName = session?.user?.name ?? session?.user?.email ?? null;
  return (
    <DashboardShell
      initialApplications={applications}
      agentName={agentName}
    />
  );
}

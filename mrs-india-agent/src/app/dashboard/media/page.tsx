import { connectToDatabase } from "@/lib/mongodb";
import { MediaAsset, MEDIA_SLOTS } from "@/models/MediaAsset";
import { Application } from "@/models/Application";
import { auth } from "@/auth";
import { Sidebar } from "../sidebar";
import { MediaEditor, type MediaMap } from "./media-editor";

export const dynamic = "force-dynamic";

async function getMediaMap(): Promise<MediaMap> {
  await connectToDatabase();
  const assets = await MediaAsset.find().lean();
  const map: MediaMap = {};
  for (const asset of assets) {
    if (typeof asset.slot === "string" && typeof asset.url === "string") {
      map[asset.slot] = { url: asset.url };
    }
  }
  return map;
}

async function getPendingCount(): Promise<number> {
  await connectToDatabase();
  return Application.countDocuments({ status: "pending" });
}

export default async function MediaPage() {
  const [session, mediaMap, pendingCount] = await Promise.all([
    auth(),
    getMediaMap(),
    getPendingCount(),
  ]);
  const agentName = session?.user?.name ?? session?.user?.email ?? "Admin User";

  return (
    <div className="grid h-screen overflow-hidden grid-cols-[64px_1fr] lg:grid-cols-[240px_1fr]">
      <Sidebar pendingCount={pendingCount} agentName={agentName} />

      <main className="flex flex-col overflow-hidden">
        <header className="h-16 bg-surface border-b border-border flex items-center px-8 shrink-0">
          <div className="font-serif text-2xl text-text font-medium">Media</div>
        </header>

        <div className="flex-1 overflow-y-auto p-5 md:p-8 animate-fade-in">
          <MediaEditor initial={mediaMap} slots={MEDIA_SLOTS} />
        </div>
      </main>
    </div>
  );
}

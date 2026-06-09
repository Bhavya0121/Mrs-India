import { connectToDatabase } from "@/lib/mongodb";
import MediaAsset from "@/models/MediaAsset";

type MediaAssetLean = { slot?: string; url?: string };

export async function getMediaMap(): Promise<Record<string, string>> {
  try {
    await connectToDatabase();
    const assets = await MediaAsset.find().lean<MediaAssetLean[]>();
    const map: Record<string, string> = {};
    for (const asset of assets) {
      if (typeof asset.slot === "string" && typeof asset.url === "string") {
        map[asset.slot] = asset.url;
      }
    }
    return map;
  } catch (err) {
    console.error("getMediaMap failed:", err);
    return {};
  }
}

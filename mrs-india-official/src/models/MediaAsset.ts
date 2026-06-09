import { Schema, model, models } from "mongoose";

export const MEDIA_SLOTS = [
  { key: "hero-main", label: "Hero Main" },
  { key: "about-1", label: "About 1" },
  { key: "about-2", label: "About 2" },
  { key: "sushmita", label: "Sushmita Sen Portrait" },
  { key: "category-diva", label: "Category — Diva" },
  { key: "category-queen", label: "Category — Queen" },
  { key: "category-legend", label: "Category — Legend" },
  { key: "category-shakti", label: "Category — Shakti" },
  { key: "founder", label: "Founder Portrait" },
  { key: "mentor-1", label: "Mentor 1" },
  { key: "mentor-2", label: "Mentor 2" },
  { key: "mentor-3", label: "Mentor 3" },
  { key: "mentor-4", label: "Mentor 4" },
] as const;

const mediaAssetSchema = new Schema(
  {
    slot: { type: String, required: true, unique: true, index: true },
    url: { type: String, required: true },
    filename: { type: String },
    size: { type: Number },
  },
  { collection: "media_assets", timestamps: true }
);

const MediaAsset = models.MediaAsset || model("MediaAsset", mediaAssetSchema);

export default MediaAsset;

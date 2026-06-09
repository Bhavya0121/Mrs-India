import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

export const MEDIA_SLOTS = [
  { key: "hero-main", label: "Hero Main" },
  { key: "about-1", label: "About 1" },
  { key: "about-2", label: "About 2" },
  { key: "sushmita", label: "Sushmita Portrait" },
  { key: "category-diva", label: "Category — Diva" },
  { key: "category-queen", label: "Category — Queen" },
  { key: "category-legend", label: "Category — Legend" },
  { key: "category-shakti", label: "Category — Shakti" },
  { key: "founder", label: "Founder Portrait" },
  { key: "mentor-1", label: "Mentor 1" },
  { key: "mentor-2", label: "Mentor 2" },
  { key: "mentor-3", label: "Mentor 3" },
  { key: "mentor-4", label: "Mentor 4" },
  { key: "mentor-5", label: "Mentor 5" },
  { key: "mentor-6", label: "Mentor 6" },
] as const;

export type MediaSlotKey = (typeof MEDIA_SLOTS)[number]["key"];

const MediaAssetSchema = new Schema(
  {
    slot: { type: String, required: true, unique: true, index: true },
    url: { type: String, required: true },
    filename: { type: String },
    size: { type: Number },
  },
  { timestamps: true, collection: "media_assets" }
);

export type MediaAssetDoc = InferSchemaType<typeof MediaAssetSchema> & {
  _id: unknown;
  createdAt: Date;
  updatedAt: Date;
};

export const MediaAsset: Model<MediaAssetDoc> =
  (models.MediaAsset as Model<MediaAssetDoc>) ||
  model<MediaAssetDoc>("MediaAsset", MediaAssetSchema);

import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const AgentSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password_hash: { type: String, required: true, select: false },
    name: { type: String },
    role: { type: String, default: "agent" },
  },
  { timestamps: true, collection: "agents" }
);

export type AgentDoc = InferSchemaType<typeof AgentSchema> & {
  _id: unknown;
  createdAt: Date;
  updatedAt: Date;
};

export const Agent: Model<AgentDoc> =
  (models.Agent as Model<AgentDoc>) ||
  model<AgentDoc>("Agent", AgentSchema);

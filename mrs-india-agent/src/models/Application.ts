import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

export const APPLICATION_STATUSES = [
  "pending",
  "shortlisted",
  "approved",
  "rejected",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

const ApplicationSchema = new Schema(
  {
    reference: { type: String, index: true },
    full_name: { type: String, required: true },
    dob: { type: String },
    marital_status: { type: String },
    nationality: { type: String },
    email: { type: String, required: true, index: true },
    phone: { type: String },
    city: { type: String },
    state: { type: String },
    category: { type: String },
    height: { type: String },
    profession: { type: String },
    instagram: { type: String },
    languages: { type: String },
    about: { type: String },
    achievements: { type: String },
    headshot_url: { type: String },
    fullbody_url: { type: String },
    emergency_name: { type: String },
    emergency_phone: { type: String },
    source: { type: String },
    terms_accepted: { type: Boolean },
    fee_amount: { type: Number },
    payment_status: { type: String },
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: "pending",
      index: true,
    },
  },
  { timestamps: true, collection: "applications" }
);

export type ApplicationDoc = InferSchemaType<typeof ApplicationSchema> & {
  _id: unknown;
  createdAt: Date;
  updatedAt: Date;
};

export const Application: Model<ApplicationDoc> =
  (models.Application as Model<ApplicationDoc>) ||
  model<ApplicationDoc>("Application", ApplicationSchema);

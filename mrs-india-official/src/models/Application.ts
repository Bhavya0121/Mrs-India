import mongoose, { Schema, model, models, type InferSchemaType } from "mongoose";
import { REGISTRATION_FEE } from "@/lib/constants";

const applicationSchema = new Schema(
  {
    reference: { type: String, unique: true },
    full_name: { type: String, required: true },
    dob: { type: String, required: true },
    marital_status: { type: String },
    nationality: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: true },
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
    terms_accepted: { type: Boolean, default: false },
    fee_amount: { type: Number, default: REGISTRATION_FEE },
    payment_status: { type: String, default: "unpaid" },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "shortlisted", "approved", "rejected"],
    },
  },
  { timestamps: true },
);

export type ApplicationDoc = InferSchemaType<typeof applicationSchema>;

const Application =
  (models.Application as mongoose.Model<ApplicationDoc>) ||
  model<ApplicationDoc>("Application", applicationSchema);

export default Application;

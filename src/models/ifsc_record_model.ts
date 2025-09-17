import { HydratedDocument, InferSchemaType, Schema, model } from "mongoose";

const IfscRecordSchema = new Schema(
  {
    ifsc: { type: String, required: true, unique: true, index: true },
    micr: { type: String },
    bank: { type: String },
    bankcode: { type: String },
    branch: { type: String },
    address: { type: String },
    state: { type: String },
    city: { type: String },
    centre: { type: String },
    district: { type: String },
    contact: { type: String },
    upi: { type: Boolean },
    rtgs: { type: Boolean },
    neft: { type: Boolean },
    imps: { type: Boolean },
    swift: { type: String },
    iso3166: { type: String },
  },
  { timestamps: true, versionKey: false }
);

export type IfscRecord = InferSchemaType<typeof IfscRecordSchema>;
export type IfscRecordDocument = HydratedDocument<IfscRecord>;
// export type IfscRecordInput = DocumentDefinition<IfscRecord>;
// export type IfscRecordLean = LeanDocument<IfscRecord>;

export const IfscRecordModel = model<IfscRecordDocument>(
  "IfscRecord",
  IfscRecordSchema,
  "ifsc_records"
);

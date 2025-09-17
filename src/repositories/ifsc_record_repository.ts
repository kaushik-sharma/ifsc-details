import {
  IfscRecord,
  IfscRecordDocument,
  IfscRecordModel,
} from "../models/ifsc_record_model.js";

export class IfscRecordRepository {
  static readonly upsertRecord = async (
    data: IfscRecord
  ): Promise<IfscRecord> => {
    return await IfscRecordModel.findOneAndUpdate(
      { ifsc: data.ifsc },
      { $set: data },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
  };

  static readonly getRecord = async (
    ifsc: string
  ): Promise<IfscRecordDocument | null> => {
    return await IfscRecordModel.findOne({ ifsc: ifsc });
  };
}

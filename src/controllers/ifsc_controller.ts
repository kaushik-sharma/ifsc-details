import { RequestHandler } from "express";

import { asyncHandler } from "../helpers/async_handler.js";
import { CustomError } from "../middlewares/error_middlewares.js";
import { IfscRecord } from "../models/ifsc_record_model.js";
import { keysToLowerCase } from "../utils/utils.js";
import { IfscRecordRepository } from "../repositories/ifsc_record_repository.js";
import { successResponseHandler } from "../helpers/success_handler.js";
import { RedisService } from "../services/redis_service.js";
import { DateTime } from "luxon";
import { Constants } from "../constants/constants.js";
import { IfscDetailsDto } from "../dtos/ifsc_dto.js";
import { RazorpayService } from "../services/razorpay_service.js";

export class IfscController {
  static readonly #hasRecordExpired = (lastFetchedAt: Date): boolean => {
    const dateTime = DateTime.fromJSDate(lastFetchedAt);
    const targetDate = dateTime.plus(Constants.mongodbIfscRecordTTL);
    const now = DateTime.now();
    return now > targetDate;
  };

  static readonly #cacheInRedis = async (
    key: string,
    value: Record<string, any>
  ) => {
    await RedisService.client.set(
      key,
      JSON.stringify(value),
      "EX",
      Constants.redisIfscRecordTTL.as("seconds")
    );
  };

  static readonly #fetchIfscDetails = async (
    ifsc: string
  ): Promise<IfscRecord> => {
    const response = await RazorpayService.getIfscDetails(ifsc);
    if (!response.ok) {
      throw new CustomError(400, `Failed to fetch details for IFSC: ${ifsc}`);
    }

    const raw = await response.json();
    const normalized = keysToLowerCase(raw) as IfscRecord;

    return normalized;
  };

  static readonly getIfscDetails: RequestHandler = asyncHandler(
    async (req, res, next) => {
      const sendResponse = (ifscRecord: IfscRecord) => {
        const ifscDetails = new IfscDetailsDto({
          ifsc: ifscRecord.ifsc,
          micr: ifscRecord.micr,
          bank: ifscRecord.bank,
          bankcode: ifscRecord.bankcode,
          branch: ifscRecord.branch,
          address: ifscRecord.address,
          state: ifscRecord.state,
          city: ifscRecord.city,
          centre: ifscRecord.centre,
          district: ifscRecord.district,
          contact: ifscRecord.contact,
          upi: ifscRecord.upi,
          rtgs: ifscRecord.rtgs,
          neft: ifscRecord.neft,
          imps: ifscRecord.imps,
          swift: ifscRecord.swift,
          iso3166: ifscRecord.iso3166,
        });

        successResponseHandler({
          res: res,
          status: 200,
          metadata: { message: "IFSC details fetched successfully." },
          data: ifscDetails,
        });
      };

      const ifsc = req.params.ifsc.toUpperCase();

      const regex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      if (!regex.test(ifsc)) {
        throw new CustomError(400, "Invalid IFSC code.");
      }

      const cachedRecord = await RedisService.client.get(ifsc);
      if (cachedRecord) {
        sendResponse(JSON.parse(cachedRecord));
        return;
      }

      const dbRecord = await IfscRecordRepository.getRecord(ifsc);
      if (dbRecord && !this.#hasRecordExpired(dbRecord.updatedAt)) {
        await this.#cacheInRedis(ifsc, dbRecord.toJSON());
        sendResponse(dbRecord);
      } else {
        const details = await this.#fetchIfscDetails(ifsc);
        const record = await IfscRecordRepository.upsertRecord(
          details as IfscRecord
        );
        await this.#cacheInRedis(ifsc, record);
        sendResponse(record);
      }
    }
  );
}

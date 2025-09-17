export interface IfscDetailsParams {
  ifsc: String;
  micr?: String | null;
  bank?: String | null;
  bankcode?: String | null;
  branch?: String | null;
  address?: String | null;
  state?: String | null;
  city?: String | null;
  centre?: String | null;
  district?: String | null;
  contact?: String | null;
  upi?: Boolean | null;
  rtgs?: Boolean | null;
  neft?: Boolean | null;
  imps?: Boolean | null;
  swift?: String | null;
  iso3166?: String | null;
}

export class IfscDetailsDto {
  constructor(params: IfscDetailsParams) {
    Object.assign(this, params);
  }
}

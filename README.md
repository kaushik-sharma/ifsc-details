# IFSC Details API

## GET `{BASE_URL}/api/v1/ifsc/:ifsc`

Fetch details for a given IFSC code.

### URL Parameters

| Parameter | Type   | Description                                                                                    |
| --------- | ------ | ---------------------------------------------------------------------------------------------- |
| `ifsc`    | string | The IFSC code to fetch info for (e.g., `HDFC0001234`). Must be a valid 11-character IFSC code. |

### Success Response

- **Status:** `200 OK`
- **Body:**

```json
{
  "metadata": {
    "message": "IFSC details fetched successfully."
  },
  "data": {
    "ifsc": "HDFC0001234",
    "micr": "302240007",
    "bank": "HDFC Bank",
    "bankcode": "HDFC",
    "branch": "PARK STREET",
    "address": "3 PARK STREET M I ROAD M I ROAD",
    "state": "RAJASTHAN",
    "city": "JAIPUR",
    "centre": "JAIPUR",
    "district": "JAIPUR",
    "contact": "+919875003333",
    "upi": true,
    "rtgs": true,
    "neft": true,
    "imps": true,
    "swift": "HDFCINBB",
    "iso3166": "IN-RJ"
  }
}
```

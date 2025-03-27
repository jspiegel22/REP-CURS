import { google } from "googleapis";
import { JWT } from "google-auth-library";

interface GoogleSheetsConfig {
  serviceAccountKey: {
    client_email: string;
    private_key: string;
    project_id: string;
  };
  spreadsheetId: string;
}

export class GoogleSheets {
  private static instance: GoogleSheets;
  private auth: JWT;

  private constructor() {
    const serviceAccountKey = JSON.parse(
      process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_KEY || "{}"
    );

    this.auth = new JWT({
      email: serviceAccountKey.client_email,
      key: serviceAccountKey.private_key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
  }

  public static getInstance(): GoogleSheets {
    if (!GoogleSheets.instance) {
      GoogleSheets.instance = new GoogleSheets();
    }
    return GoogleSheets.instance;
  }

  public async testConnection(config: GoogleSheetsConfig): Promise<{ success: boolean; message: string }> {
    try {
      const sheets = google.sheets({ version: "v4", auth: this.auth });
      await sheets.spreadsheets.get({
        spreadsheetId: config.spreadsheetId,
      });

      return {
        success: true,
        message: "Successfully connected to Google Sheets",
      };
    } catch (error) {
      console.error("Error testing Google Sheets connection:", error);
      return {
        success: false,
        message: "Failed to connect to Google Sheets",
      };
    }
  }

  public async appendRow(
    spreadsheetId: string,
    range: string,
    values: any[][]
  ): Promise<void> {
    try {
      const sheets = google.sheets({ version: "v4", auth: this.auth });
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values,
        },
      });
    } catch (error) {
      console.error("Error appending row to Google Sheets:", error);
      throw error;
    }
  }

  public async appendGuideDownload(submission: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    guideType: string;
    guideName: string;
    downloadDate: string;
  }): Promise<void> {
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    if (!spreadsheetId) {
      throw new Error("Google Sheets ID is not configured");
    }

    const values = [
      [
        submission.firstName,
        submission.lastName,
        submission.email,
        submission.phone,
        submission.guideType,
        submission.guideName,
        submission.downloadDate,
      ],
    ];

    await this.appendRow(spreadsheetId, "Guide Downloads!A:G", values);
  }

  public async appendBooking(submission: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bookingType: string;
    startDate: string;
    endDate: string;
    numberOfGuests: number;
    budget: string;
    specialRequests: string;
    status: string;
  }): Promise<void> {
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    if (!spreadsheetId) {
      throw new Error("Google Sheets ID is not configured");
    }

    const values = [
      [
        submission.firstName,
        submission.lastName,
        submission.email,
        submission.phone,
        submission.bookingType,
        submission.startDate,
        submission.endDate,
        submission.numberOfGuests,
        submission.budget,
        submission.specialRequests,
        submission.status,
      ],
    ];

    await this.appendRow(spreadsheetId, "Bookings!A:K", values);
  }

  public async appendLead(submission: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    interestType: string;
    budget: string;
    preferredContactMethod: string;
    preferredContactTime: string;
    additionalInfo: string;
  }): Promise<void> {
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    if (!spreadsheetId) {
      throw new Error("Google Sheets ID is not configured");
    }

    const values = [
      [
        submission.firstName,
        submission.lastName,
        submission.email,
        submission.phone,
        submission.interestType,
        submission.budget,
        submission.preferredContactMethod,
        submission.preferredContactTime,
        submission.additionalInfo,
      ],
    ];

    await this.appendRow(spreadsheetId, "Leads!A:I", values);
  }
}

export const googleSheets = GoogleSheets.getInstance(); 
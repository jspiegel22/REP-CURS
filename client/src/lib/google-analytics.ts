import { google } from "googleapis";
import { JWT } from "google-auth-library";

interface GoogleAnalyticsConfig {
  measurementId: string;
  serviceAccountKey: {
    client_email: string;
    private_key: string;
    project_id: string;
  };
}

export class GoogleAnalytics {
  private static instance: GoogleAnalytics;
  private auth: JWT;
  private measurementId: string;

  private constructor() {
    const serviceAccountKey = JSON.parse(
      process.env.GOOGLE_ANALYTICS_SERVICE_ACCOUNT_KEY || "{}"
    );

    this.auth = new JWT({
      email: serviceAccountKey.client_email,
      key: serviceAccountKey.private_key,
      scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
    });

    this.measurementId = process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID || "";
  }

  public static getInstance(): GoogleAnalytics {
    if (!GoogleAnalytics.instance) {
      GoogleAnalytics.instance = new GoogleAnalytics();
    }
    return GoogleAnalytics.instance;
  }

  public async testConnection(config: GoogleAnalyticsConfig): Promise<{ success: boolean; message: string }> {
    try {
      const analytics = google.analyticsdata({ version: "v1beta", auth: this.auth });
      await analytics.properties.get({
        name: `properties/${config.measurementId}`,
      });

      return {
        success: true,
        message: "Successfully connected to Google Analytics",
      };
    } catch (error) {
      console.error("Error testing Google Analytics connection:", error);
      return {
        success: false,
        message: "Failed to connect to Google Analytics",
      };
    }
  }

  public async trackEvent(event: {
    name: string;
    category: string;
    label?: string;
    value?: number;
    clientId: string;
  }): Promise<void> {
    try {
      const response = await fetch(
        `https://www.google-analytics.com/mp/collect?measurement_id=${this.measurementId}&api_secret=${process.env.GOOGLE_ANALYTICS_API_SECRET}`,
        {
          method: "POST",
          body: JSON.stringify({
            client_id: event.clientId,
            events: [
              {
                name: event.name,
                params: {
                  category: event.category,
                  label: event.label,
                  value: event.value,
                },
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to track event");
      }
    } catch (error) {
      console.error("Error tracking event in Google Analytics:", error);
      throw error;
    }
  }

  public async trackPageView(page: string, clientId: string): Promise<void> {
    await this.trackEvent({
      name: "page_view",
      category: "engagement",
      label: page,
      clientId,
    });
  }

  public async trackFormSubmission(
    formType: string,
    clientId: string
  ): Promise<void> {
    await this.trackEvent({
      name: "form_submission",
      category: "conversion",
      label: formType,
      value: 1,
      clientId,
    });
  }

  public async trackGuideDownload(
    guideType: string,
    clientId: string
  ): Promise<void> {
    await this.trackEvent({
      name: "guide_download",
      category: "conversion",
      label: guideType,
      value: 1,
      clientId,
    });
  }

  public async trackBookingRequest(
    bookingType: string,
    clientId: string
  ): Promise<void> {
    await this.trackEvent({
      name: "booking_request",
      category: "conversion",
      label: bookingType,
      value: 1,
      clientId,
    });
  }
}

export const googleAnalytics = GoogleAnalytics.getInstance(); 
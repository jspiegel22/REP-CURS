import axios from "axios";

interface ActiveCampaignConfig {
  apiKey: string;
  listId: string;
}

export class ActiveCampaign {
  private static instance: ActiveCampaign;
  private apiKey: string;
  private baseUrl: string;

  private constructor() {
    this.apiKey = process.env.ACTIVECAMPAIGN_API_KEY || "";
    this.baseUrl = process.env.ACTIVECAMPAIGN_API_URL || "";
  }

  public static getInstance(): ActiveCampaign {
    if (!ActiveCampaign.instance) {
      ActiveCampaign.instance = new ActiveCampaign();
    }
    return ActiveCampaign.instance;
  }

  public async testConnection(config: ActiveCampaignConfig): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/3/contacts`, {
        headers: {
          "Api-Token": config.apiKey,
        },
        params: {
          limit: 1,
        },
      });

      return {
        success: true,
        message: "Successfully connected to ActiveCampaign",
      };
    } catch (error) {
      console.error("Error testing ActiveCampaign connection:", error);
      return {
        success: false,
        message: "Failed to connect to ActiveCampaign",
      };
    }
  }

  public async addContact(contact: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    listId: string;
  }): Promise<void> {
    try {
      await axios.post(
        `${this.baseUrl}/api/3/contacts`,
        {
          contact: {
            email: contact.email,
            firstName: contact.firstName,
            lastName: contact.lastName,
            phone: contact.phone,
          },
        },
        {
          headers: {
            "Api-Token": this.apiKey,
          },
        }
      );

      // Add contact to list
      await axios.post(
        `${this.baseUrl}/api/3/contactLists`,
        {
          contactList: {
            contact: { email: contact.email },
            list: contact.listId,
          },
        },
        {
          headers: {
            "Api-Token": this.apiKey,
          },
        }
      );
    } catch (error) {
      console.error("Error adding contact to ActiveCampaign:", error);
      throw error;
    }
  }
}

export const activeCampaign = ActiveCampaign.getInstance(); 
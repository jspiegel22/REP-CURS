import { NextApiRequest, NextApiResponse } from "next";
import { ActiveCampaign } from "@/lib/activecampaign";
import { GoogleSheets } from "@/lib/google-sheets";
import { GoogleAnalytics } from "@/lib/google-analytics";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { type, action, config } = req.body;

  try {
    switch (type) {
      case "activecampaign":
        if (action === "test") {
          const result = await ActiveCampaign.testConnection(config);
          return res.status(200).json(result);
        }
        break;

      case "google-sheets":
        if (action === "test") {
          const result = await GoogleSheets.testConnection(config);
          return res.status(200).json(result);
        }
        break;

      case "google-analytics":
        if (action === "test") {
          const result = await GoogleAnalytics.testConnection(config);
          return res.status(200).json(result);
        }
        break;

      default:
        return res.status(400).json({ message: "Invalid integration type" });
    }

    return res.status(400).json({ message: "Invalid action" });
  } catch (error) {
    console.error(`Error testing ${type} integration:`, error);
    return res.status(500).json({ message: `Error testing ${type} integration` });
  }
} 
import { NextApiRequest, NextApiResponse } from "next";
import { Airtable } from "@/lib/airtable";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const submissions = await Airtable.getGuideDownloads();
    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error fetching guide downloads:", error);
    res.status(500).json({ message: "Error fetching guide downloads" });
  }
} 
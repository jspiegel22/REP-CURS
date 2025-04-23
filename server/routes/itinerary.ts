import { Router } from "express";
import { generateItinerary, chatWithItinerary } from "../services/openai";
import { log } from "../vite";

const router = Router();

/**
 * Generate a personalized itinerary based on user preferences
 */
router.post("/generate-itinerary", async (req, res) => {
  try {
    const { stayType, numNights, startDate, budget, additionalInfo } = req.body;

    // Basic validation
    if (!stayType || !numNights || !startDate) {
      return res.status(400).json({
        error: "Missing required parameters. Please provide stayType, numNights, and startDate.",
      });
    }

    // Generate the itinerary
    log(`Generating itinerary for ${stayType} stay, ${numNights} nights from ${startDate}`, "itinerary");
    
    const itinerary = await generateItinerary({
      stayType,
      numNights: Number(numNights),
      startDate,
      budget,
      additionalInfo,
    });

    return res.json({
      success: true,
      itinerary,
    });
  } catch (error) {
    console.error("Error generating itinerary:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    });
  }
});

/**
 * Chat with the AI about an itinerary
 */
router.post("/chat-with-itinerary", async (req, res) => {
  try {
    const { chatHistory, preferences } = req.body;

    // Basic validation
    if (!chatHistory || !Array.isArray(chatHistory) || !preferences) {
      return res.status(400).json({
        error: "Missing required parameters. Please provide chatHistory array and preferences object.",
      });
    }

    // Chat with the AI
    log(`Processing itinerary chat request`, "itinerary");
    
    const response = await chatWithItinerary(chatHistory, preferences);

    return res.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error("Error in itinerary chat:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    });
  }
});

export default router;
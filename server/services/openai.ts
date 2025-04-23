import OpenAI from "openai";

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

export interface ItineraryPreferences {
  stayType: string;
  numNights: number;
  startDate: string;
  budget?: string;
  additionalInfo?: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Generate a personalized Cabo San Lucas itinerary based on user preferences
 */
export async function generateItinerary(preferences: ItineraryPreferences): Promise<string> {
  const { stayType, numNights, startDate, budget, additionalInfo } = preferences;

  const prompt = `
Generate a personalized itinerary for a ${stayType} trip to Cabo San Lucas for ${numNights} nights starting on ${startDate}.
${budget ? `The budget for this trip is approximately ${budget}.` : ''}
${additionalInfo ? `Additional preferences: ${additionalInfo}` : ''}

Follow these guidelines:
1. Create a day-by-day breakdown of activities, dining, and experiences.
2. Include specific restaurant recommendations with brief descriptions.
3. Suggest age-appropriate activities for ${stayType === 'family' ? 'all ages' : 'adults'}.
4. Highlight must-see attractions and hidden gems in Cabo.
5. Keep recommendations authentic and local, avoiding generic tourist traps.
6. If the stay type is "luxury", focus on high-end experiences, fine dining, and exclusive activities.
7. If the stay type is "adventure", include outdoor activities like hiking, water sports, and exploration.
8. If the stay type is "family", suggest family-friendly activities and dining options suitable for children.
9. If the stay type is "couple", recommend romantic experiences, sunset dinners, and intimate activities.
10. If the stay type is "group", suggest activities that work well for larger parties and social experiences.
11. If the stay type is "party", focus on nightlife, bars, clubs, and social events.
12. Format the response with clear headings and well-organized text.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: "You are a knowledgeable travel concierge specializing in Cabo San Lucas, Mexico. You provide detailed, personalized itineraries based on traveler preferences." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    return response.choices[0].message.content || "Unable to generate itinerary at this time. Please try again later.";
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw new Error("Failed to generate itinerary. Please try again later.");
  }
}

/**
 * Continue a conversation about a Cabo itinerary
 */
export async function chatWithItinerary(
  chatHistory: ChatMessage[],
  preferences: Pick<ItineraryPreferences, "stayType" | "numNights" | "startDate">
): Promise<string> {
  const systemPrompt = `
You are a knowledgeable travel concierge specializing in Cabo San Lucas, Mexico.
You're helping a user with their ${preferences.stayType} trip to Cabo for ${preferences.numNights} nights starting on ${preferences.startDate}.
Answer their questions about the itinerary, provide alternatives if requested, and offer detailed information about activities, restaurants, and experiences in Cabo.
Keep your responses helpful, detailed, and specific to Cabo. If asked about booking, encourage the user to use the "Book This Itinerary" button.
`;

  try {
    const messages = [
      { role: "system", content: systemPrompt },
      ...chatHistory.map(msg => ({ role: msg.role, content: msg.content })),
    ];

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't process your request at this time. Please try again.";
  } catch (error) {
    console.error("Error in chat with itinerary:", error);
    throw new Error("Failed to process your message. Please try again later.");
  }
}
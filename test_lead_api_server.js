// This is a simplified version of the API endpoint to test form submissions
import express from 'express';
import cors from 'cors';
import { nanoid } from 'nanoid';

const app = express();
const PORT = 3000;

// Enable JSON parsing and CORS
app.use(express.json());
app.use(cors());

// Route to handle lead form submissions
app.post('/api/leads', (req, res) => {
  try {
    console.log("Received lead form submission:");
    console.log(JSON.stringify(req.body, null, 2));
    
    const leadData = req.body;
    
    // Extract first and last name for consistency 
    const firstName = leadData.firstName || leadData.first_name || '';
    const lastName = leadData.lastName || leadData.last_name || '';
    
    // Process the data similar to the actual webhookClient.ts
    const processedData = {
      ...leadData,
      // Ensure first_name and last_name are at the top level and overwrite any existing values
      first_name: firstName,
      last_name: lastName,
      firstName: firstName,
      lastName: lastName,
      tracking_id: leadData.tracking_id || nanoid(),
      webhook_type: 'lead',
      submission_type: 'Lead'
    };
    
    // Log the data that would be sent to Make.com/Airtable
    console.log("\nData that would be sent to Make.com:");
    console.log(JSON.stringify(processedData, null, 2));
    
    // Verify key fields for Airtable
    console.log("\nVerification of fields for Airtable:");
    console.log(`first_name: ${processedData.first_name}`);
    console.log(`last_name: ${processedData.last_name}`);
    console.log(`email: ${processedData.email}`);
    console.log(`phone: ${processedData.phone}`);
    console.log(`interestType: ${processedData.interestType}`);
    
    // Return success response
    res.status(200).json({
      success: true,
      message: "Form submitted successfully",
      tracking_id: processedData.tracking_id
    });
  } catch (error) {
    console.error("Error processing form submission:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test API server running on port ${PORT}`);
  console.log(`Ready to receive form submissions at http://localhost:${PORT}/api/leads`);
});
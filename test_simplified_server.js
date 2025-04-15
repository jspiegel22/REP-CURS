// A simplified Express server to test form submissions
import express from 'express';
import cors from 'cors';
import { nanoid } from 'nanoid';

const app = express();
const PORT = 3000;

// Enable JSON parsing and CORS
app.use(express.json());
app.use(cors());

// Store submissions in memory for testing
const submissions = {
  leads: [],
  bookings: [],
  guides: []
};

// Endpoint to handle lead form submissions
app.post('/api/leads', (req, res) => {
  try {
    const leadData = req.body;
    
    // Extract first and last name for consistency (our fix)
    const firstName = leadData.firstName || leadData.first_name || '';
    const lastName = leadData.lastName || leadData.last_name || '';
    
    // Process the data similar to the actual application
    const processedData = {
      ...leadData,
      id: submissions.leads.length + 1,
      // Ensure first_name and last_name are at the top level
      first_name: firstName,
      last_name: lastName,
      firstName: firstName,
      lastName: lastName,
      tracking_id: leadData.tracking_id || nanoid(),
      webhook_type: 'lead',
      submission_type: 'Lead',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Extract data from formData for easier access
    if (leadData.formData) {
      if (leadData.formData.checkIn) processedData.start_date = leadData.formData.checkIn;
      if (leadData.formData.checkOut) processedData.end_date = leadData.formData.checkOut;
      if (leadData.formData.numberOfTravelers) processedData.number_of_travelers = parseInt(leadData.formData.numberOfTravelers) || 0;
      if (leadData.formData.numberOfChildren) processedData.number_of_travelers = (parseInt(leadData.formData.numberOfChildren) || 0) + 2;
      if (leadData.formData.notes) processedData.notes = leadData.formData.notes;
      processedData.source_page = leadData.formName || '';
    }
    
    // Store and log the submission
    submissions.leads.push(processedData);
    console.log('Received lead submission:');
    console.log(JSON.stringify(processedData, null, 2));
    
    // Log the specific fields needed for Airtable mapping
    console.log('\nFields mapped for Airtable:');
    console.log('first_name:', processedData.first_name);
    console.log('last_name:', processedData.last_name);
    console.log('email:', processedData.email);
    console.log('phone:', processedData.phone);
    console.log('interestType:', processedData.interestType);
    console.log('budget:', processedData.budget);
    console.log('start_date:', processedData.start_date);
    console.log('end_date:', processedData.end_date);
    console.log('number_of_travelers:', processedData.number_of_travelers);
    console.log('notes:', processedData.notes);
    console.log('source_page:', processedData.source_page);
    
    // Return success response
    res.status(201).json(processedData);
  } catch (error) {
    console.error('Error processing lead submission:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running on port ${PORT}`);
  console.log('Ready to receive form submissions');
});
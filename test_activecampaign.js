import fetch from 'node-fetch';

async function submitTestLead() {
  const leadData = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '555-123-4567',
    source: 'test-script',
    interestType: 'villa',
    budget: '$5000-$10000',
    timeline: 'Summer 2025',
    formName: 'Test Form',
    formData: {
      additionalInfo: 'Test lead from ActiveCampaign test script',
      testField: 'Testing AC Integration'
    }
  };

  try {
    console.log('Submitting test lead to API...');
    const response = await fetch('http://localhost:3000/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(leadData)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Lead submitted successfully!');
      console.log('Response:', JSON.stringify(data, null, 2));
      return true;
    } else {
      console.error('Failed to submit lead. Status:', response.status);
      console.error('Response:', await response.text());
      return false;
    }
  } catch (error) {
    console.error('Error submitting lead:', error);
    return false;
  }
}

// Run the test
submitTestLead()
  .then(success => {
    if (success) {
      console.log('Test completed successfully');
    } else {
      console.log('Test failed');
    }
  })
  .catch(error => {
    console.error('Unhandled error during test:', error);
  });
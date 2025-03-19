interface EmailOptions {
  to: string;
  template: string;
  data: Record<string, any>;
}

const config = {
  apiKey: process.env.ACTIVECAMPAIGN_API_KEY,
  apiUrl: process.env.ACTIVECAMPAIGN_API_URL,
};

export async function sendActiveCampaignEmail(options: EmailOptions): Promise<void> {
  try {
    const response = await fetch(`${config.apiUrl}/api/3/emails`, {
      method: 'POST',
      headers: {
        'Api-Token': config.apiKey!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: {
          subject: getEmailSubject(options.template),
          from: process.env.ACTIVECAMPAIGN_FROM_EMAIL,
          to: options.to,
          html: await getEmailTemplate(options.template, options.data),
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error sending ActiveCampaign email:', error);
    throw error;
  }
}

async function getEmailTemplate(template: string, data: Record<string, any>): Promise<string> {
  // In a real implementation, you would fetch the template from ActiveCampaign
  // and replace placeholders with actual data
  const templates: Record<string, string> = {
    'image-upload-confirmation': `
      <h1>Thank you for uploading your image!</h1>
      <p>Dear {{name}},</p>
      <p>Your image has been successfully uploaded to the {{folder}} folder.</p>
      <p>You can view your image here: <a href="{{imageUrl}}">{{imageUrl}}</a></p>
      <p>Best regards,<br>The Cabo Adventures Team</p>
    `,
    // Add more templates as needed
  };

  let html = templates[template] || '';
  
  // Replace placeholders with actual data
  Object.entries(data).forEach(([key, value]) => {
    html = html.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
  });

  return html;
}

function getEmailSubject(template: string): string {
  const subjects: Record<string, string> = {
    'image-upload-confirmation': 'Image Upload Confirmation - Cabo Adventures',
    // Add more subjects as needed
  };

  return subjects[template] || 'Message from Cabo Adventures';
}

export async function subscribeToNewsletter(email: string): Promise<void> {
  try {
    const response = await fetch(`${config.apiUrl}/api/3/contacts`, {
      method: 'POST',
      headers: {
        'Api-Token': config.apiKey!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contact: {
          email,
          tags: ['newsletter'],
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to subscribe to newsletter: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    throw error;
  }
}

export async function addToAutomation(email: string, automationId: string): Promise<void> {
  try {
    const response = await fetch(`${config.apiUrl}/api/3/automations/${automationId}/contacts`, {
      method: 'POST',
      headers: {
        'Api-Token': config.apiKey!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contact: {
          email,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add contact to automation: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error adding contact to automation:', error);
    throw error;
  }
} 
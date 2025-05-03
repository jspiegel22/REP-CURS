import { GuideSubmission } from '@shared/schema';
import { sendEmail, createGuideConfirmationEmail } from './emailService';
// Import commented out as we're now using Make.com webhook instead
// import { retryFailedSync, syncGuideSubmissionToAirtable } from './airtable';

export async function processGuideSubmission(submission: GuideSubmission): Promise<boolean> {
  try {
    // Step 1: Skip Airtable sync (now using Make.com webhook instead)
    // Airtable sync commented out to avoid authorization errors
    // await retryFailedSync(syncGuideSubmissionToAirtable, submission);

    // Send confirmation email
    const { firstName, lastName, email, guideType } = submission;
    const name = `${firstName} ${lastName}`;

    await sendEmail({
      to: email,
      subject: 'Cabo Guide Download Confirmation',
      html: createGuideConfirmationEmail({
        name,
        email,
        guideType: guideType || 'Cabo Travel'
      })
    });

    console.log(`Guide submission processed successfully for ${submission.email}`);
    return true;
  } catch (error) {
    console.error('Error processing guide submission:', error);
    return false;
  }
}
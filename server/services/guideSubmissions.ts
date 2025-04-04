import { GuideSubmission } from '@shared/schema';
import { sendEmail, createGuideDownloadEmail, getGuideDownloadUrl } from './emailService';
import { retryFailedSync, syncGuideSubmissionToAirtable } from './airtable';

/**
 * Process a guide submission by syncing to Airtable, generating a download link,
 * and sending a confirmation email with the link
 * 
 * @param submission The guide submission to process
 * @returns boolean indicating success or failure
 */
export async function processGuideSubmission(submission: GuideSubmission): Promise<boolean> {
  try {
    console.log(`Processing guide submission for ${submission.email}`);
    
    // Step 1: Generate a download URL for the guide
    const downloadUrl = await getGuideDownloadUrl(submission.guideType);
    
    // Step 2: Update the submission with the download link
    submission.downloadLink = downloadUrl;
    submission.processedAt = new Date();
    
    // Step 3: Sync to Airtable (will retry on failure)
    await retryFailedSync(syncGuideSubmissionToAirtable, submission);
    
    // Step 4: Create and send the confirmation email
    const emailOptions = await createGuideDownloadEmail(
      submission.firstName,
      submission.email,
      submission.guideType
    );
    
    const emailSent = await sendEmail(emailOptions);
    
    if (emailSent) {
      console.log(`✅ Guide submission processed successfully for ${submission.email}`);
    } else {
      console.warn(`⚠️ Email failed to send for ${submission.email}, but processing continued`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error processing guide submission:', error);
    return false;
  }
}
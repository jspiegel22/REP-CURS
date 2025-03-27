import { GuideSubmission } from '@shared/schema';
import { sendEmail, createGuideDownloadEmail } from './emailService';
import { retryFailedSync, syncGuideSubmissionToAirtable } from './airtable';

export async function processGuideSubmission(submission: GuideSubmission): Promise<boolean> {
  try {
    // Step 1: Sync to Airtable
    await retryFailedSync(syncGuideSubmissionToAirtable, submission);
    
    // Step 2: Send confirmation email
    const emailOptions = createGuideDownloadEmail(
      submission.firstName,
      submission.email,
      submission.guideType
    );
    
    await sendEmail(emailOptions);
    
    console.log(`Guide submission processed successfully for ${submission.email}`);
    return true;
  } catch (error) {
    console.error('Error processing guide submission:', error);
    return false;
  }
}
import Airtable from 'airtable';
import { GuideSubmission } from '@shared/schema';
import { sendEmail, createGuideDownloadEmail } from './emailService';
import { retryFailedSync } from './airtable';

// Get API key from environment variables
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || 'pathWHIzP3lxGRdWM.f1298c67689266c18302187f7bfef1872a80d42166331902c246458d07185451';
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || 'zKq3J9js9AKhpH';

const airtable = new Airtable({ apiKey: AIRTABLE_API_KEY });
const base = airtable.base(AIRTABLE_BASE_ID);

const GUIDES_TABLE = 'Guide Submissions';

export async function syncGuideSubmissionToAirtable(submission: GuideSubmission): Promise<string> {
  try {
    console.log('Syncing guide submission to Airtable:', submission);
    const record = await base(GUIDES_TABLE).create([{
      fields: {
        'First Name': submission.firstName,
        'Email': submission.email,
        'Guide Type': submission.guideType,
        'Source': submission.source,
        'Form Name': submission.formName,
        'Status': submission.status,
        'Submission ID': submission.submissionId,
        'Submission Date': submission.createdAt?.toISOString() || new Date().toISOString(),
      }
    }]);

    return record[0].getId();
  } catch (error) {
    console.error('Error syncing guide submission to Airtable:', error);
    throw new Error('Failed to sync guide submission to Airtable');
  }
}

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
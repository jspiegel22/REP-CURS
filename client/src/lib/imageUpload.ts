import { google } from 'googleapis';
import { Readable } from 'stream';

interface GoogleDriveConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  refreshToken: string;
  folderId: string;
}

const config: GoogleDriveConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  redirectUri: process.env.GOOGLE_REDIRECT_URI!,
  refreshToken: process.env.GOOGLE_REFRESH_TOKEN!,
  folderId: process.env.GOOGLE_DRIVE_FOLDER_ID!,
};

const oauth2Client = new google.auth.OAuth2(
  config.clientId,
  config.clientSecret,
  config.redirectUri
);

oauth2Client.setCredentials({
  refresh_token: config.refreshToken,
});

const drive = google.drive({ version: 'v3', auth: oauth2Client });

interface UploadedImage {
  id: string;
  name: string;
  webViewLink: string;
  thumbnailLink: string;
}

export async function uploadImage(
  file: File,
  folder: string = 'general'
): Promise<UploadedImage> {
  try {
    // Convert File to Buffer
    const buffer = await file.arrayBuffer();
    const stream = Readable.from(Buffer.from(buffer));

    // Create folder if it doesn't exist
    const folderMetadata = {
      name: folder,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [config.folderId],
    };

    const folderResponse = await drive.files.create({
      requestBody: folderMetadata,
      fields: 'id',
    });

    // Upload file
    const fileMetadata = {
      name: file.name,
      parents: [folderResponse.data.id!],
    };

    const media = {
      mimeType: file.type,
      body: stream,
    };

    const fileResponse = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, name, webViewLink, thumbnailLink',
    });

    // Make file publicly accessible
    await drive.permissions.create({
      fileId: fileResponse.data.id!,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    return {
      id: fileResponse.data.id!,
      name: fileResponse.data.name!,
      webViewLink: fileResponse.data.webViewLink!,
      thumbnailLink: fileResponse.data.thumbnailLink!,
    };
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw error;
  }
}

export async function deleteImage(fileId: string): Promise<void> {
  try {
    await drive.files.delete({
      fileId,
    });
  } catch (error) {
    console.error('Error deleting from Google Drive:', error);
    throw error;
  }
}

export async function listImages(folder: string = 'general'): Promise<UploadedImage[]> {
  try {
    const response = await drive.files.list({
      q: `'${config.folderId}' in parents and mimeType contains 'image/'`,
      fields: 'files(id, name, webViewLink, thumbnailLink)',
      spaces: 'drive',
    });

    return response.data.files!.map(file => ({
      id: file.id!,
      name: file.name!,
      webViewLink: file.webViewLink!,
      thumbnailLink: file.thumbnailLink!,
    }));
  } catch (error) {
    console.error('Error listing Google Drive files:', error);
    throw error;
  }
} 
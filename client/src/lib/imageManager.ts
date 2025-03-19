import { google } from 'googleapis';
import { Readable } from 'stream';

interface GoogleDriveConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  refreshToken: string;
  folderId: string;
}

interface ImageMetadata {
  id: string;
  name: string;
  webViewLink: string;
  thumbnailLink: string;
  category?: string;
  tags?: string[];
}

const config: GoogleDriveConfig = {
  clientId: process.env.GOOGLE_DRIVE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_DRIVE_CLIENT_SECRET!,
  redirectUri: process.env.GOOGLE_DRIVE_REDIRECT_URI!,
  refreshToken: process.env.GOOGLE_DRIVE_REFRESH_TOKEN!,
  folderId: process.env.GOOGLE_DRIVE_FOLDER_ID!,
};

// Initialize Google Drive API client
const oauth2Client = new google.auth.OAuth2(
  config.clientId,
  config.clientSecret,
  config.redirectUri
);

oauth2Client.setCredentials({
  refresh_token: config.refreshToken,
});

const drive = google.drive({ version: 'v3', auth: oauth2Client });

export async function uploadImage(
  file: File,
  category: string,
  tags: string[] = []
): Promise<ImageMetadata> {
  try {
    // Convert File to Buffer
    const buffer = await file.arrayBuffer();
    const stream = Readable.from(Buffer.from(buffer));

    // Create folder if it doesn't exist
    const folderName = category.toLowerCase().replace(/\s+/g, '-');
    let folderId = await getOrCreateFolder(folderName);

    // Upload file
    const response = await drive.files.create({
      requestBody: {
        name: file.name,
        parents: [folderId],
        properties: {
          category,
          tags: tags.join(','),
        },
      },
      media: {
        mimeType: file.type,
        body: stream,
      },
    });

    // Make file publicly accessible
    await drive.permissions.create({
      fileId: response.data.id!,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    return {
      id: response.data.id!,
      name: response.data.name!,
      webViewLink: response.data.webViewLink!,
      thumbnailLink: response.data.thumbnailLink!,
      category,
      tags,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

async function getOrCreateFolder(folderName: string): Promise<string> {
  try {
    // Search for existing folder
    const response = await drive.files.list({
      q: `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and '${config.folderId}' in parents and trashed = false`,
      fields: 'files(id, name)',
    });

    if (response.data.files && response.data.files.length > 0) {
      return response.data.files[0].id!;
    }

    // Create new folder if it doesn't exist
    const folder = await drive.files.create({
      requestBody: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [config.folderId],
      },
    });

    return folder.data.id!;
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
}

export async function listImages(
  category?: string,
  tags?: string[]
): Promise<ImageMetadata[]> {
  try {
    let query = `'${config.folderId}' in parents and trashed = false`;
    
    if (category) {
      query += ` and properties has { key='category' and value='${category}' }`;
    }
    
    if (tags && tags.length > 0) {
      query += ` and properties has { key='tags' and value='${tags.join(',')}' }`;
    }

    const response = await drive.files.list({
      q: query,
      fields: 'files(id, name, webViewLink, thumbnailLink, properties)',
    });

    return response.data.files?.map(file => ({
      id: file.id!,
      name: file.name!,
      webViewLink: file.webViewLink!,
      thumbnailLink: file.thumbnailLink!,
      category: file.properties?.category,
      tags: file.properties?.tags?.split(','),
    })) || [];
  } catch (error) {
    console.error('Error listing images:', error);
    throw error;
  }
}

export async function deleteImage(imageId: string): Promise<void> {
  try {
    await drive.files.delete({
      fileId: imageId,
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

export async function updateImageMetadata(
  imageId: string,
  metadata: Partial<ImageMetadata>
): Promise<ImageMetadata> {
  try {
    const response = await drive.files.update({
      fileId: imageId,
      requestBody: {
        properties: {
          category: metadata.category,
          tags: metadata.tags?.join(','),
        },
      },
    });

    return {
      id: response.data.id!,
      name: response.data.name!,
      webViewLink: response.data.webViewLink!,
      thumbnailLink: response.data.thumbnailLink!,
      category: metadata.category,
      tags: metadata.tags,
    };
  } catch (error) {
    console.error('Error updating image metadata:', error);
    throw error;
  }
} 
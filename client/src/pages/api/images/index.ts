import { NextApiRequest, NextApiResponse } from 'next';
import { uploadImage, listImages, deleteImage, updateImageMetadata } from '@/lib/imageManager';
import { generateImageName } from '@/lib/imageUtils';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    case 'DELETE':
      return handleDelete(req, res);
    case 'PATCH':
      return handlePatch(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PATCH']);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { category, tags } = req.query;
    const images = await listImages(
      category as string,
      tags ? (tags as string).split(',') : undefined
    );
    return res.status(200).json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const form = formidable();
    const [fields, files] = await form.parse(req);

    const file = files.image?.[0];
    if (!file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const category = fields.category?.[0];
    const purpose = fields.purpose?.[0];
    const size = fields.size?.[0];
    const descriptor = fields.descriptor?.[0];
    const tags = fields.tags?.[0]?.split(',') || [];

    if (!category || !purpose || !size) {
      return res.status(400).json({ 
        message: 'Category, purpose, and size are required' 
      });
    }

    // Generate the image name according to the convention
    const imageName = generateImageName(
      category,
      purpose,
      { width: 0, height: 0 }, // Dimensions will be validated by the frontend
      descriptor
    );

    const image = await uploadImage(file, category, tags);
    return res.status(201).json(image);
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { imageId } = req.query;
    if (!imageId) {
      return res.status(400).json({ message: 'Image ID is required' });
    }

    await deleteImage(imageId as string);
    return res.status(204).end();
  } catch (error) {
    console.error('Error deleting image:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function handlePatch(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { imageId } = req.query;
    if (!imageId) {
      return res.status(400).json({ message: 'Image ID is required' });
    }

    const { category, tags } = req.body;
    const image = await updateImageMetadata(imageId as string, {
      category,
      tags: tags ? tags.split(',') : undefined,
    });

    return res.status(200).json(image);
  } catch (error) {
    console.error('Error updating image:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 
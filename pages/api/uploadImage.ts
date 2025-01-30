// pages/api/uploadImage.ts
import { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from '../../config/cloudinary';
import formidable, { IncomingForm } from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing to handle it manually
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const form = new IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return res.status(500).json({ error: 'Error parsing form' });
      }

      const fileArray = files.file as formidable.File[];
      if (!fileArray || fileArray.length === 0) {
        console.error('No file found in the request.');
        return res.status(400).json({ error: 'No file found in the request.' });
      }

      const file = fileArray[0];
      console.log('Incoming file:', file);

      const filePath = file.filepath;

      try {
        const uploadedImage = await cloudinary.uploader.upload(filePath, {
          upload_preset: 'my_upload_preset', // Ensure this is correct
        });
        console.log('Uploaded Image URL:', uploadedImage.secure_url);
        return res.status(200).json({ url: uploadedImage.secure_url });
      } catch (uploadError: unknown) {
        if (uploadError instanceof Error) {
          // Handle known error
          console.error('Error uploading image:', uploadError.message); // Log the error message
          return res.status(500).json({ error: uploadError.message }); // Return the error message
        } else {
          // Handle unknown error
          console.error('Unknown error uploading image:', uploadError); // Log the unknown error
          return res.status(500).json({ error: 'An unknown error occurred' });
        }
      }
    });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}

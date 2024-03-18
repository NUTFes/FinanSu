import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import { formidable } from 'formidable';
import * as Minio from 'minio';

export const config = {
  api: {
    bodyParser: false,
  },
};

const minioClient = new Minio.Client({
  // endPoint: '100.81.148.25',
  endPoint: '192.168.176.1',
  port: 9000,
  useSSL: false,
  accessKey: 'bE5KYqihEcEXMrgkVhZn',
  secretKey: 'oQvamjXnAvrsyneZdluX7S49TfRi0na6AO8WNPuL',
  // endPoint: process.env.NEXT_PUBLIC_ENDPOINT,
  // port: Number(process.env.NEXT_PUBLIC_PORT),
  // accessKey: process.env.NEXT_PUBLIC_ACCESS_KEY,
  // secretKey: process.env.NEXT_PUBLIC_SECRET_KEY,
  // useSSL: false,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const form = formidable();
    const fs = require('fs');

    form.parse(req, async (err, fields, files: any) => {
      if (err) {
        throw new Error('Error parsing form');
      }

      const bucketName = 'finansu';
      const fileName = files.file[0].originalFilename;
      const file = files.file[0];
      const mimetype = file.mimetype;
      const metaData = {
        'Content-Type': mimetype,
      };

      // console.log(bucketName);
      console.log(fileName);
      console.log(files.file);
      // console.log(files.file[0].filepath);
      // console.log(mimetype);

      // minioClient.bucketExists('finansu', function (err: any, exists: any) {
      //   if (err) {
      //     return console.log(err);
      //   }
      //   if (exists) {
      //     return console.log('Bucket exists.');
      //   }
      // });

      try {
        const response = await minioClient.putObject(
          bucketName,
          fileName,
          fs.createReadStream(files.file[0].filepath),
          metaData,
        );

        res.status(200).json({ response });
      } catch (err) {
        throw new Error('Error uploading file (' + err + ')');
      }
    });
  }
}

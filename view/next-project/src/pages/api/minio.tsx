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
  endPoint: process.env.NEXT_PUBLIC_ENDPOINT || '',
  port: Number(process.env.NEXT_PUBLIC_PORT),
  accessKey: process.env.NEXT_PUBLIC_ACCESS_KEY || '',
  secretKey: process.env.NEXT_PUBLIC_SECRET_KEY || '',
  useSSL: false,
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

      try {
        const response = await minioClient.putObject(
          bucketName,
          fileName,
          fs.createReadStream(files.file[0].filepath),
          metaData,
        );
      } catch (err) {
        res.status(400).json({ message: '失敗' });
        throw new Error('Error uploading file (' + err + ')');
      }
      return res.status(200).json({ message: '成功' });
    });
  }

  if (req.method === 'GET') {
    try {
      var size = 0;
      const response = minioClient.fGetObject('finansu', 'go.png', '/tmp/go.png', function (err) {
        if (err) {
          return console.log(err);
        }
        console.log('success');
      });

      res.status(200).json({ response: response });
    } catch (err) {
      res.status(400);
      throw new Error('Error uploading file (' + err + ')');
    }
  }
}

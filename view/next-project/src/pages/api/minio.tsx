import fs from 'fs';
import { formidable } from 'formidable';
import { Client } from 'minio';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

const minioClient = new Client({
  endPoint: process.env.NEXT_PUBLIC_ENDPOINT || '',
  port: Number(process.env.NEXT_PUBLIC_PORT),
  accessKey: process.env.NEXT_PUBLIC_ACCESS_KEY || '',
  secretKey: process.env.NEXT_PUBLIC_SECRET_KEY || '',
  useSSL: false,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const form = formidable();

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
      const size = 0;
      const response = minioClient.fGetObject(
        'finansu',
        'go.png',
        '/tmp/go.png',
        function (err: any) {
          if (err) {
            return console.log(err);
          }
          console.log('success');
        },
      );

      res.status(200).json({ response: response });
    } catch (err) {
      res.status(400);
      throw new Error('Error uploading file (' + err + ')');
    }
  }
}

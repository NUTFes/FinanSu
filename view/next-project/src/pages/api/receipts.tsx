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

const BUCKET_NAME = 'finansu';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 開発環境でバケットがない場合作成
  if (process.env.NEXT_PUBLIC_APP_ENV === 'development') {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    !exists && (await makeBucket());
  }

  // ここから画像送信処理
  if (req.method === 'POST') {
    const form = formidable();

    form.parse(req, async (err, fields, files: any) => {
      if (err) {
        throw new Error('Error parsing form');
      }

      const bucketName = 'finansu';
      const year = fields.year && fields.year[0];
      const fileName = fields.fileName
        ? `${year}/receipts/${fields.fileName}`
        : `${year}/receipts/${files.file[0].originalFilename}`;
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

  // 変更の場合の画像を削除する
  if (req.method === 'DELETE') {
    const form = formidable();

    form.parse(req, async (err, fields, files: any) => {
      if (err) {
        throw new Error('Error parsing form');
      }

      const bucketName = BUCKET_NAME;
      const year = fields.year && fields.year[0];
      const fileName = fields.fileName && fields.fileName;
      const filePath = `${year}/receipts/${fileName}`;

      try {
        await minioClient.removeObject(BUCKET_NAME, filePath);
        console.log('Removed the object');
      } catch (err) {
        res.status(400).json({ message: '失敗' });
        throw new Error('Error uploading file (' + err + ')');
      }
      return res.status(200).json({ message: '成功' });
    });
  }
}

// バケットがない時に作成する関数(環境構築時のみ)
async function makeBucket() {
  await minioClient.makeBucket(BUCKET_NAME);
  const policy = {
    // awsが導入したポリシー言語のバージョン
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: '*',
        Action: ['s3:GetObject'],
        Resource: `arn:aws:s3:::${BUCKET_NAME}/*`,
      },
    ],
  };

  minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
}

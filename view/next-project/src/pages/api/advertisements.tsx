import fs from 'fs';
import path from 'path';
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
const TEMP_DIR = path.join(process.cwd(), 'temp');

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
        res.status(500).json({ message: 'Error parsing form' });
        return;
      }

      const chunkIndex = fields.chunkIndex ? parseInt(fields.chunkIndex[0]) : 0;
      const totalChunks = fields.totalChunks ? parseInt(fields.totalChunks[0]) : 0;
      const fileName = fields.fileName ? fields.fileName[0] : '';
      const year = fields.year ? fields.year[0] : '';
      const tempFilePath = path.join(TEMP_DIR, `${fileName}.part${chunkIndex}`);

      if (!fs.existsSync(TEMP_DIR)) {
        fs.mkdirSync(TEMP_DIR);
      }

      try {
        fs.copyFileSync(files.file[0].filepath, tempFilePath);
        fs.unlinkSync(files.file[0].filepath);
      } catch (error) {
        res.status(500).json({ message: 'Error handling file' });
        return;
      }

      if (chunkIndex === totalChunks - 1) {
        const finalFilePath = path.join(TEMP_DIR, fileName);
        const writeStream = fs.createWriteStream(finalFilePath);

        for (let i = 0; i < totalChunks; i++) {
          const partFilePath = path.join(TEMP_DIR, `${fileName}.part${i}`);
          const data = fs.readFileSync(partFilePath);
          writeStream.write(data);
          fs.unlinkSync(partFilePath);
        }

        writeStream.end();

        writeStream.on('finish', async () => {
          if (fs.existsSync(finalFilePath)) {
            const bucketName = 'finansu';
            const filePath = `${year}/advertisements/${fileName}`;
            const mimetype = files.file[0].mimetype;
            const metaData = {
              'Content-Type': mimetype,
            };

            try {
              await minioClient.putObject(
                bucketName,
                filePath,
                fs.createReadStream(finalFilePath),
                metaData,
              );
              fs.unlinkSync(finalFilePath);
              const fileUrl = `${process.env.NEXT_PUBLIC_ENDPOINT}/${bucketName}/${filePath}`;
              res.status(200).json({ message: '成功', fileUrl });
            } catch (err) {
              res.status(400).json({ message: '失敗' });
            }
          } else {
            res.status(500).json({ message: '結合されたファイルが存在しません' });
          }
        });
      } else {
        res.status(200).json({ message: 'チャンク受信成功' });
      }
    });
  } else if (req.method === 'DELETE') {
    // 変更の場合の画像を削除する
    const form = formidable();

    form.parse(req, async (err, fields) => {
      if (err) {
        res.status(500).json({ message: 'Error parsing form' });
        return;
      }

      const year = fields.year && fields.year[0];
      const fileName = fields.fileName && fields.fileName[0];
      const filePath = `${year}/advertisements/${fileName}`;

      try {
        await minioClient.removeObject(BUCKET_NAME, filePath);
        res.status(200).json({ message: '成功' });
      } catch (err) {
        res.status(400).json({ message: '失敗' });
      }
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
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

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

if (!process.env.DO_SPACES_KEY || !process.env.DO_SPACES_SECRET) {
  throw new Error('DO_SPACES_ENDPOINT,DO_SPACES_KEY and DO_SPACES_SECRET must be set');
}

const s3 = new S3Client({
  region: 'nyc3',
  endpoint: `https://${process.env.DO_SPACES_ENDPOINT}`,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  },
});

export class UploadsDAO {
  static async uploadImages(images: ImageUploadPayload[]) {
    const uploads = images.map(async (image) => {
      try {
        const buffer = Buffer.from(image.file, 'base64');
        const filename = `${image.path}.${image.fileType.split('/')[1]}`;

        const upload = new PutObjectCommand({
          Bucket: process.env.DO_SPACES_BUCKET,
          Key: filename,
          Body: buffer,
          ACL: 'public-read',
          ContentType: image.fileType,
        });

        await s3.send(upload);

        const url = `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_ENDPOINT}/${
          filename.startsWith('/') ? filename.slice(1) : filename
        }`;

        return {
          name: image.name,
          url,
        };
      } catch (error) {
        console.error(`[SC] Error uploading image ${image.name}`, error);
        return null;
      }
    });

    const urls = await Promise.all(uploads);

    return urls
      .filter((url) => url !== null)
      .reduce((acc, image) => {
        acc[image.name] = image.url;
        return acc;
      }, {} as { [name: string]: string });
  }
}

type ImageUploadPayload = {
  name: string;
  path: string;
  file: string;
  fileType: string;
};

export const getImageUploadPayload = ({
  userId,
  path,
  name,
  image,
}: {
  userId: string;
  path: string;
  name: string;
  image: string;
}): ImageUploadPayload => {
  return {
    name,
    path: `${userId}/${path.startsWith('/') ? path.slice(1) : path}`,
    file: image.split(',')[1],
    fileType: image.split(';')[0].split(':')[1],
  };
};

import { createClient } from '@utils/supabase/server';
import sharp from 'sharp';

export class UploadsDAO {
  static async uploadImages(images: ImageUploadPayload[]) {
    const supabase = await createClient();

    const uploads = images.map(async (image) => {
      const buffer = Buffer.from(image.file, 'base64');
      const filename = `${image.bucket}/${image.fileName}.${image.fileType.split('/')[1]}`;

      // Get image dimensions before upload
      const metadata = await sharp(buffer).metadata();
      const dimensions = {
        width: metadata.width,
        height: metadata.height,
        aspectRatio: metadata.width && metadata.height ? metadata.width / metadata.height : null,
      };

      const { error } = await supabase.storage.from('assets').upload(filename, buffer, {
        contentType: image.fileType,
        upsert: true,
      });

      if (error) {
        console.error(`[SC] Error uploading image ${image.id}`, error);
        return null;
      }

      return {
        id: image.id,
        url: filename,
        dimensions,
      };
    });

    const urls = await Promise.all(uploads);

    return urls
      .filter((url) => url !== null)
      .reduce((acc, image) => {
        acc[image.id] = {
          url: image.url,
          dimensions: image.dimensions,
        };
        return acc;
      }, {} as { [name: string]: { url: string; dimensions: ImageDimensions } });
  }

  static async deleteImages(filenames: string[]) {
    const supabase = await createClient();

    const { error } = await supabase.storage.from('assets').remove(filenames);

    return error;
  }
}

type ImageUploadPayload = {
  bucket: string;
  id: string;
  file: string;
  fileName: string;
  fileType: string;
};

type ImageDimensions = {
  width: number | undefined;
  height: number | undefined;
  aspectRatio: number | null;
};

export const getImageUploadPayload = ({
  bucket,
  id,
  fileName,
  file,
}: {
  bucket: string;
  id: string;
  fileName: string;
  file: string;
}): ImageUploadPayload => {
  return {
    bucket,
    id,
    file: file.split(',')[1],
    fileName,
    fileType: file.split(';')[0].split(':')[1],
  };
};

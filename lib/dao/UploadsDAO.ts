import { createClient } from '@utils/supabase/server';

export class UploadsDAO {
  static async uploadImages(images: ImageUploadPayload[]) {
    const supabase = await createClient();

    const uploads = images.map(async (image) => {
      const buffer = Buffer.from(image.file, 'base64');
      const filename = `${image.bucket}/${image.fileName}.${image.fileType.split('/')[1]}`;

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
      };
    });

    const urls = await Promise.all(uploads);

    return urls
      .filter((url) => url !== null)
      .reduce((acc, image) => {
        acc[image.id] = image.url;
        return acc;
      }, {} as { [name: string]: string });
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

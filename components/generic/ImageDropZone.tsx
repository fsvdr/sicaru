import { ImageMetadata } from '@types';
import cn from '@utils/cn';
import { getPublicUrl } from '@utils/getPublicUrl';
import { UploadCloud, X } from 'lucide-react';
import { ChangeEvent, DragEvent, useCallback, useState } from 'react';

interface ImageDropZoneProps {
  name: string;
  width?: string;
  height?: string;
  defaultImageUrl: string | ImageMetadata | null;
  className?: string;
  onChange: (image: string | null) => void;
}

const ImageDropZone = ({ name, width, height, defaultImageUrl, className, onChange }: ImageDropZoneProps) => {
  const [image, setImage] = useState<string | ImageMetadata | null>(defaultImageUrl);

  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    if (e.type === 'dragleave') setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFiles(e.dataTransfer.files);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files) handleFiles(e.target.files);
  };

  const handleFiles = (files: FileList) => {
    const file = files[0];

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImage(e.target.result as string);
          onChange(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setImage(null);
    onChange(null);
  };

  const imageUrl = image
    ? typeof image === 'string'
      ? image.startsWith('data:image/')
        ? image
        : getPublicUrl(image)
      : getPublicUrl(image.url)
    : undefined;

  return (
    <div
      style={{ width: width ? `${width}px` : 'auto', height: height ? `${height}px` : 'auto' }}
      className={cn(
        `relative flex items-center justify-center rounded-lg transition-colors`,
        'hover:border-slate-400',
        image ? '' : 'border border-dashed border-slate-200',
        isDragging ? 'border-primary bg-primary/10' : 'border-gray-300',
        className
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label="Upload image"
      />

      <input type="hidden" name={name} value={typeof image === 'string' ? image : image?.url ?? ''} />

      {imageUrl ? (
        <>
          <img src={imageUrl} alt="Uploaded preview" className="object-cover w-full h-full rounded-lg" />

          <div className="absolute right-1 top-1">
            <button onClick={handleRemove} className="p-1 rounded bg-melrose-100" aria-label="Remove image">
              <X size={12} />
            </button>
          </div>
        </>
      ) : (
        <div className="p-2 text-center">
          <UploadCloud size={22} className="mx-auto text-muted-foreground" />
          <p className="mt-2 text-2xs text-muted-foreground">Arrastra o da click</p>
        </div>
      )}
    </div>
  );
};

export default ImageDropZone;

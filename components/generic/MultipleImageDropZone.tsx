'use client';

import cn from '@utils/cn';
import { UploadCloud, X } from 'lucide-react';
import Image from 'next/image';
import { ChangeEvent, DragEvent, useCallback, useState } from 'react';

interface MultipleImageDropZoneProps {
  name: string;
  width?: string;
  height?: string;
  defaultImageUrls?: string[];
  className?: string;
  onChange?: (images: string[]) => void;
  maxImages?: number;
}

const MultipleImageDropZone = ({
  name,
  width,
  height,
  defaultImageUrls = [],
  className,
  onChange,
  maxImages = 5,
}: MultipleImageDropZoneProps) => {
  const [images, setImages] = useState<string[]>(defaultImageUrls);
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
    const remainingSlots = maxImages - images.length;
    const filesToProcess = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;

        setImages((prev) => {
          const newImages = [...prev, dataUrl];
          onChange?.(newImages);
          return newImages;
        });
      };

      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index);
      onChange?.(newImages);
      return newImages;
    });
  };

  return (
    <div className={cn('flex flex-col gap-4')}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {images.map((image, index) => (
          <div className="relative aspect-video" key={index}>
            <input type="hidden" name={`${name}.${index}`} value={image} />

            <Image src={image} alt={`Product image ${index + 1}`} fill className="object-cover rounded-lg" />

            <div className="absolute right-1 top-1">
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="p-1 rounded bg-melrose-100"
                aria-label="Remove image"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        ))}

        {images.length < maxImages && (
          <div
            style={{ width: width ? `${width}px` : 'auto', height: height ? `${height}px` : 'auto' }}
            className={cn(
              `relative flex items-center justify-center rounded-lg transition-colors`,
              'hover:border-slate-400',
              'border border-dashed border-slate-200',
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
              multiple
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Upload image"
            />

            <div className="p-2 text-center">
              <UploadCloud size={22} className="mx-auto text-muted-foreground" />
              <p className="mt-2 text-2xs text-muted-foreground">Arrastra o da click</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultipleImageDropZone;

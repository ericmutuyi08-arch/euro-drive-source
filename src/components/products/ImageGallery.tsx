import { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
  name: string;
}

const ImageGallery = ({ images, name }: ImageGalleryProps) => {
  const [selected, setSelected] = useState(0);
  const displayImages = images.length ? images : ['/placeholder.svg'];

  return (
    <div className="space-y-3">
      <div className="aspect-square bg-muted rounded-lg overflow-hidden border border-border">
        <img
          src={displayImages[selected]}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {displayImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-16 h-16 rounded border-2 overflow-hidden shrink-0 transition-colors ${
                i === selected ? 'border-primary' : 'border-border hover:border-muted-foreground'
              }`}
            >
              <img src={img} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;

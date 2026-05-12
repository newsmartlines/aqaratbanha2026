import { useState } from "react";
import { ImageOff } from "lucide-react";

interface PropertyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export default function PropertyImage({ src, alt, className, ...props }: PropertyImageProps) {
  const [error, setError] = useState(!src);

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-100 text-gray-300 gap-2 ${className ?? ""}`}>
        <ImageOff className="w-8 h-8" />
        <span className="text-xs font-medium text-gray-400">لا يوجد صورة</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}

import React, { ChangeEvent } from 'react';
import { Camera, X, Upload } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  imageSrc: string | null;
  onImageSelect: (base64: string | null) => void;
  id: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ label, imageSrc, onImageSelect, id }) => {
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    onImageSelect(null);
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-slate-600">{label}</label>
      
      {imageSrc ? (
        <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-emerald-500 shadow-sm group">
          <img src={imageSrc} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              onClick={clearImage}
              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-64 border-2 border-dashed border-slate-300 rounded-xl hover:border-emerald-400 hover:bg-emerald-50 transition-all cursor-pointer group">
          <input 
            id={id}
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 group-hover:text-emerald-600 pointer-events-none">
            <div className="bg-slate-100 group-hover:bg-emerald-100 p-4 rounded-full mb-3 transition-colors">
              <Camera className="w-8 h-8" />
            </div>
            <span className="font-medium">Upload Foto</span>
            <span className="text-xs mt-1 text-slate-400">atau ambil gambar</span>
          </div>
        </div>
      )}
    </div>
  );
};
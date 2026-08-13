import React, { useRef, useState } from 'react';
import { Upload, X, Check, Image as ImageIcon, Sparkles, UserCheck, AlertCircle } from 'lucide-react';
import { SAMPLE_SELFIES } from '../data/options';
import { SampleSelfie } from '../types';

interface SelfieUploadProps {
  selectedImage: string | null;
  onImageSelect: (base64Image: string) => void;
  onClearImage: () => void;
}

export const SelfieUpload: React.FC<SelfieUploadProps> = ({
  selectedImage,
  onImageSelect,
  onClearImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (JPEG, PNG, WEBP).');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('File size exceeds 15MB. Please choose a smaller image.');
      return;
    }

    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onImageSelect(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSelectSample = async (sample: SampleSelfie) => {
    setErrorMsg(null);
    try {
      // Fetch image and convert to base64 for reliable API usage
      const response = await fetch(sample.url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          onImageSelect(reader.result as string);
        }
      };
      reader.readAsDataURL(blob);
    } catch {
      // Fallback directly using URL
      onImageSelect(sample.url);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="flex items-center text-base font-semibold text-white">
            <span className="mr-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-400 border border-indigo-500/30">
              1
            </span>
            Source Photo
          </h2>
          <p className="text-xs text-slate-400">
            Upload a casual selfie or front-facing phone picture
          </p>
        </div>
        {selectedImage && (
          <button
            onClick={onClearImage}
            className="flex items-center space-x-1 text-xs text-rose-400 hover:text-rose-300 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            <span>Remove Photo</span>
          </button>
        )}
      </div>

      {/* Selected Image Preview or Upload Dropzone */}
      {selectedImage ? (
        <div className="relative group overflow-hidden rounded-xl border border-indigo-500/30 bg-slate-950 p-2">
          <div className="relative mx-auto max-h-72 w-full overflow-hidden rounded-lg bg-slate-900 flex justify-center items-center">
            <img
              src={selectedImage}
              alt="Source Selfie"
              className="h-64 w-full object-cover object-top rounded-lg"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-2 right-2 rounded-full bg-emerald-500/90 p-1.5 text-white shadow-md">
              <Check className="h-4 w-4" />
            </div>
            <div className="absolute bottom-2 left-2 rounded-lg bg-slate-950/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-slate-200 border border-slate-700/50">
              Reference Selfie Loaded
            </div>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 flex w-full items-center justify-center space-x-2 rounded-lg border border-slate-700 bg-slate-800/80 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
          >
            <Upload className="h-3.5 w-3.5 text-indigo-400" />
            <span>Change Photo</span>
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all ${
            isDragging
              ? 'border-indigo-500 bg-indigo-500/10'
              : 'border-slate-700 bg-slate-950/50 hover:border-indigo-500/50 hover:bg-slate-900/80'
          }`}
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Upload className="h-6 w-6" />
          </div>
          <h3 className="mt-3 text-sm font-semibold text-white">
            Drag & Drop or Click to Upload
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            JPEG, PNG, WEBP up to 15MB
          </p>

          <div className="mt-4 flex justify-center items-center space-x-4 text-[11px] text-slate-400">
            <span className="flex items-center">
              <UserCheck className="mr-1 h-3.5 w-3.5 text-emerald-400" /> Good Lighting
            </span>
            <span className="flex items-center">
              <UserCheck className="mr-1 h-3.5 w-3.5 text-emerald-400" /> Clear Face
            </span>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {errorMsg && (
        <div className="mt-3 flex items-center space-x-2 rounded-lg bg-rose-500/10 p-2.5 text-xs text-rose-300 border border-rose-500/20">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Sample Selfies Quick Selector */}
      <div className="mt-5 border-t border-slate-800/80 pt-4">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-medium text-slate-300 flex items-center">
            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-amber-400" />
            No selfie handy? Try a sample photo:
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {SAMPLE_SELFIES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className="group relative overflow-hidden rounded-lg border border-slate-800 bg-slate-950 p-1 hover:border-indigo-500 transition-all text-left"
            >
              <img
                src={sample.url}
                alt={sample.name}
                className="h-14 w-full object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <span className="block truncate text-[10px] font-medium text-slate-300 mt-1 px-0.5">
                {sample.name.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

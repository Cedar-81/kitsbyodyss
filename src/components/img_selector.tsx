import { useRef, useState } from "react";

export default function ImageSelector({ onChange, onChangeFile, className="", previewClassName="" }: { onChange?: (dataUrl: string | null) => void, onChangeFile?: (file: File | null) => void, className?: string, previewClassName?: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const data = reader.result as string
      setImage(data);
      onChange?.(data)
      onChangeFile?.(file)
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] ?? null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleChange}
        className="hidden"
      />

      {!image ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`cursor-pointer border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 
          ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="text-4xl">📷</div>
            <p className="text-gray-600 font-medium">
              Click or drag image to upload
            </p>
            <p className="text-sm text-gray-400">
              PNG, JPG up to 5MB
            </p>
          </div>
        </div>
      ) : (
        <div className="relative group">
          <img
            src={image}
            alt="Preview"
            className={`w-full ${previewClassName || "h-64"} object-cover rounded-2xl shadow-lg`}
          />

          <div className="absolute inset-0 bg-black/40 lg:opacity-0 group-hover:opacity-100 transition-all rounded-2xl flex items-center justify-center gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-black px-4 py-2 rounded-xl font-medium hover:scale-105 transition"
            >
              Change
            </button>

            <button
              onClick={() => { setImage(null); onChange?.(null); onChangeFile?.(null) }}
              className="bg-red-500 text-white px-4 py-2 rounded-xl font-medium hover:scale-105 transition"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
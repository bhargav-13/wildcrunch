"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onFileSelect?: (file: File | null) => void;
}

export default function ImageUpload({ value, onChange, onFileSelect }: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(value);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Pass file to parent component
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
    if (onFileSelect) {
      onFileSelect(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUrlChange = (url: string) => {
    onChange(url);
    setPreview(url);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Product Image</Label>

        {/* Image Preview */}
        {preview ? (
          <div className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50">
            <img
              src={preview}
              alt="Product preview"
              className="w-full h-full object-contain"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition bg-gray-50"
          >
            <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Click to upload image</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (max 5MB)</p>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Upload Button */}
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          {preview ? "Change Image" : "Upload Image"}
        </Button>
      </div>

      {/* URL Input Alternative */}
      <div className="space-y-2">
        <Label htmlFor="imageUrl" className="text-sm text-gray-500">
          Or enter image URL
        </Label>
        <Input
          id="imageUrl"
          value={value}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://..."
          type="url"
        />
      </div>

      {/* Info Text */}
      <p className="text-xs text-gray-500">
        Upload an image file or provide a URL. Uploaded images will be stored on Cloudinary.
      </p>
    </div>
  );
}

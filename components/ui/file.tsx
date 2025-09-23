'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';

interface FileUploadFieldProps {
  label: string;
  name?: string;
  accept?: string;
  required?: boolean;
  value: File | null;
  previewUrl?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  error?: string;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  name,
  accept = 'image/*',
  required = false,
  value,
  previewUrl: initialPreviewUrl,
  onChange,
  onRemove,
  inputRef,
  error,
}) => {
  const [localPreviewUrl, setLocalPreviewUrl] = useState(null);

  // Use server-provided preview URL if available, otherwise use local preview
  const previewUrl = localPreviewUrl || initialPreviewUrl;
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Create preview for new files
      const reader = new FileReader();
      reader.onload = (e) => {
        setLocalPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);

      // Call parent onChange handler
      if (onChange) onChange(e);
    }
  };

  const handleRemove = () => {
    setLocalPreviewUrl(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    if (onRemove) onRemove();
  };

  // Determine if we should show file info (has value OR has server preview)
  const hasFile = value || initialPreviewUrl;

  const inputId = name || `input-${Math.random().toString(36).substring(2, 11)}`;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="space-y-2 relative">
      <label className="text-sm font-medium text-gray-700 cursor-pointer">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="file"
        id={name}
        name={name}
        ref={inputRef}
        onChange={handleFileChange}
        accept={accept}
        required={required}
        className="absolute opacity-0 w-0 h-0 overflow-hidden pointer-events-none"
      />

      {hasFile ? (
        <div className="space-y-4">
          <div className="file-info flex justify-between items-center p-3 bg-gray-50 rounded-md">
            <div className="flex items-center space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="truncate max-w-[250px]">
                {value ? value.name : 'Uploaded File'}
              </span>
              <span>
                {value
                  ? (value.size / (1024 * 1024)).toPrecision(2) + 'MB'
                  : ''}
              </span>
            </div>
            <button
              onClick={handleRemove}
              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
              aria-label="Remove file"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {previewUrl && (
            <div className="flex flex-col items-center p-4 border border-dashed border-gray-300 rounded-lg">
              <h3 className="text-md font-medium mb-2 text-gray-700">
                Preview
              </h3>
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full max-h-40 object-contain rounded-sm border-2 border-dashed border-[#d1d5db]"
              />
            </div>
          )}
        </div>
      ) : (
        <div
          className="upload-area border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            Click to upload your {label.toLowerCase()}
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 1MB</p>
          <button
            type="button"
            className={cn(
              'mt-4 px-4 py-2 bg-secondary text-muted-foreground rounded-md hover:ring-1 hover:ring-primary transition-all duration-200 ease-in-out hover:translate-y-[-2px] cursor-pointer',
              error && 'border-destructive focus-visible:ring-destructive'
            )}
          >
            Choose File
          </button>
        </div>
      )}
      {error && (
        <p
          id={errorId}
          className="text-sm text-destructive"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export { FileUploadField };

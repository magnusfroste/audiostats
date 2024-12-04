'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 25MB
const ACCEPTED_TYPES = {
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/m4a': ['.m4a'],
  'audio/aac': ['.aac'],
  'audio/mp4': ['.m4a']
};

export function FileUploader({ onFileSelect, disabled = false }: FileUploaderProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);

    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError('File is too large. Maximum size is 50MB.');
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('Invalid file type. Please upload an MP3, WAV, M4A, or AAC file.');
      } else {
        setError('Invalid file. Please try again.');
      }
      return;
    }

    if (acceptedFiles.length > 0 && !disabled) {
      const file = acceptedFiles[0];
      if (file.size > MAX_FILE_SIZE) {
        setError('File is too large. Maximum size is 50MB.');
        return;
      }
      onFileSelect(file);
    }
  }, [onFileSelect, disabled]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    disabled,
    maxFiles: 1,
    multiple: false,
    maxSize: MAX_FILE_SIZE,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
        `}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M24 8v20m0-20l-8 8m8-8l8 8m-8 12a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
          <div className="text-sm text-gray-600">
            {disabled ? (
              <p>Processing audio...</p>
            ) : (
              <>
                <p className="font-medium">Drop your audio file here or click to browse</p>
                <p className="mt-1">Supports MP3, WAV, M4A, and AAC</p>
                <p className="mt-1 text-xs text-gray-500">Maximum file size: 50MB</p>
              </>
            )}
          </div>
        </div>
      </div>
      {error && (
        <div className="text-sm text-red-600 bg-red-50 rounded-md p-3">
          {error}
        </div>
      )}
    </div>
  );
}

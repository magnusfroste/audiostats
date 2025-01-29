'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { AudioRecorder } from './AudioRecorder';

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
    <div className="w-full space-y-6">
      <div className="flex items-center justify-center space-x-4 mb-4">
        <AudioRecorder onRecordingComplete={onFileSelect} disabled={disabled} />
        <span className="text-gray-400">or</span>
        <div {...getRootProps()} className={`flex-1 p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <input {...getInputProps()} />
          <p className="text-gray-600">
            {isDragActive ? 'Drop the audio file here' : 'Drag & drop an audio file here, or click to select'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Supports MP3, WAV, M4A, or AAC (max 50MB)
          </p>
        </div>
      </div>
      {error && (
        <div className="text-red-500 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
}

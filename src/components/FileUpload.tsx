
import React, { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';
import { FormFile } from '@/types/form';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  value: FormFile;
  onChange: (value: FormFile) => void;
  id: string;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ value, onChange, id, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFile = (file: File): { valid: boolean; message?: string } => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
      return { valid: false, message: 'Only PDF, JPG, and PNG files are allowed' };
    }
    
    if (file.size > maxSize) {
      return { valid: false, message: 'File size must be less than 5MB' };
    }
    
    return { valid: true };
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const validation = validateFile(file);
      
      if (!validation.valid) {
        toast({
          title: "Invalid file",
          description: validation.message,
          variant: "destructive"
        });
        return;
      }
      
      onChange({
        file,
        preview: URL.createObjectURL(file)
      });
    }
  }, [onChange, toast]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const validation = validateFile(file);
      
      if (!validation.valid) {
        toast({
          title: "Invalid file",
          description: validation.message,
          variant: "destructive"
        });
        return;
      }
      
      onChange({
        file,
        preview: URL.createObjectURL(file)
      });
    }
  }, [onChange, toast]);

  const handleClick = useCallback(() => {
    document.getElementById(id)?.click();
  }, [id]);

  return (
    <div>
      <div 
        className={`border border-dashed rounded-lg p-8 text-center transition-colors relative ${isDragging ? 'border-blue-500 bg-blue-50' : error ? 'border-red-500' : 'border-gray-300'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        style={{ minHeight: '160px' }}
      >
        <input 
          type="file" 
          id={id} 
          className="hidden" 
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png" 
        />
        
        {value.file ? (
          <div className="flex flex-col items-center">
            <div className="text-sm font-medium text-gray-700 mb-1">{value.file.name}</div>
            <div className="text-xs text-gray-500">{(value.file.size / 1024 / 1024).toFixed(2)} MB</div>
          </div>
        ) : (
          <>
            <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">Drag and drop your document</p>
            <p className="text-xs text-gray-500 mt-1">or click to browse files</p>
          </>
        )}
        
        {/* File format info positioned at bottom left */}
        {!value.file && (
          <div className="absolute bottom-3 left-3 flex items-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1 text-gray-400">
              <path d="M14 3v4a1 1 0 0 0 1 1h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 9h1M9 13h6M9 17h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs text-gray-400">PDF, JPG or PNG (max. 5MB)</span>
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default FileUpload;

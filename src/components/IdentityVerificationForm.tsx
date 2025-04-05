
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Calendar } from 'lucide-react';
import { z } from 'zod';
import { IdentityVerificationData } from '@/types/form';
import FileUpload from './FileUpload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface IdentityVerificationFormProps {
  data: IdentityVerificationData;
  onChange: (data: IdentityVerificationData) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSaveDraft: () => void;
}

const idTypes = [
  "Passport",
  "National ID Card",
  "Driver's License",
  "Social Security Card",
  "Birth Certificate"
];

// Form validation schema
const fileSchema = z.object({
  file: z.instanceof(File).nullable().refine(file => file !== null, { message: "Document is required" }),
  preview: z.string().nullable()
});

const identityVerificationSchema = z.object({
  idType: z.string().min(1, { message: "ID type is required" }),
  idNumber: z.string().min(1, { message: "ID number is required" }),
  expiryDate: z.string().min(1, { message: "Expiry date is required" }),
  document: fileSchema
});

const IdentityVerificationForm: React.FC<IdentityVerificationFormProps> = ({ 
  data,
  onChange,
  onNext, 
  onPrevious, 
  onSaveDraft 
}) => {
  const [errors, setErrors] = useState<Record<string, any>>({});

  const validateForm = () => {
    try {
      identityVerificationSchema.parse(data);
      setErrors({});
      return true;
    } catch (error: any) {
      if (error.errors) {
        const formattedErrors: Record<string, any> = {};
        error.errors.forEach((err: any) => {
          const path = err.path.join('.');
          formattedErrors[path] = err.message;
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  const handleSubmit = () => {
    const isValid = validateForm();
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Identity Verification</h1>
        <p className="text-gray-600 mt-1">Verify your identity for security purposes</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm mb-8">
        <div className="flex items-center mb-4">
          <div className="bg-blue-50 p-2 rounded-md mr-3">
            <Shield className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Identity Verification</h2>
            <p className="text-gray-500 text-sm">Upload your identification documents</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="idType" className="block text-sm font-medium text-gray-700 mb-1">ID Type</label>
            <Select
              value={data.idType}
              onValueChange={(value) => onChange({ ...data, idType: value })}
            >
              <SelectTrigger id="idType" className={errors['idType'] ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select ID type" />
              </SelectTrigger>
              <SelectContent>
                {idTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors['idType'] && (
              <p className="text-xs text-red-500 mt-1">{errors['idType']}</p>
            )}
          </div>

          <div>
            <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
            <Input
              id="idNumber"
              placeholder="Enter your ID number"
              value={data.idNumber}
              onChange={(e) => onChange({ ...data, idNumber: e.target.value })}
              className={errors['idNumber'] ? 'border-red-500' : ''}
            />
            {errors['idNumber'] && (
              <p className="text-xs text-red-500 mt-1">{errors['idNumber']}</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="expiryDate"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !data.expiryDate && "text-muted-foreground",
                  errors['expiryDate'] ? 'border-red-500' : ''
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {data.expiryDate ? format(new Date(data.expiryDate), "PPP") : <span>Select expiry date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={data.expiryDate ? new Date(data.expiryDate) : undefined}
                onSelect={(date) => onChange({ ...data, expiryDate: date ? date.toISOString() : '' })}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
          {errors['expiryDate'] && (
            <p className="text-xs text-red-500 mt-1">{errors['expiryDate']}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Identity Document</label>
          <FileUpload
            id="identityDocument"
            value={data.document}
            onChange={(file) => onChange({ ...data, document: file })}
            error={errors['document.file']}
          />
          <p className="text-xs text-gray-500 mt-1">
            Upload a clear photo or scan of your identification document. 
            Only JPG, PNG, or PDF files up to 5MB are accepted.
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-md mt-6">
          <p className="text-sm text-blue-700">
            <strong>Privacy Note:</strong> Your identification documents are encrypted and stored securely. 
            They will only be used for verification purposes and will not be shared with third parties.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap justify-between mt-8">
        <Button
          type="button"
          variant="outline"
          className="mb-2 sm:mb-0"
          onClick={onSaveDraft}
        >
          Save Draft
        </Button>
        
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="mb-2 sm:mb-0"
            onClick={onPrevious}
          >
            Back
          </Button>
          
          <Button
            type="button"
            className="bg-gray-900 text-white"
            onClick={handleSubmit}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IdentityVerificationForm;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail } from 'lucide-react';
import { z } from 'zod';

interface BasicDetailsFormProps {
  data: {
    firstName: string;
    lastName: string;
    email: string;
  };
  onChange: (data: any) => void;
  onNext: () => void;
  onSaveDraft: () => void;
}

// Form validation schema
const basicDetailsSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" })
});

const BasicDetailsForm: React.FC<BasicDetailsFormProps> = ({ 
  data, 
  onChange, 
  onNext, 
  onSaveDraft 
}) => {
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const validateForm = () => {
    try {
      basicDetailsSchema.parse(data);
      setErrors({});
      return true;
    } catch (error: any) {
      if (error.errors) {
        const formattedErrors: Record<string, string> = {};
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
        <h1 className="text-2xl font-bold text-gray-800">Basic Details</h1>
        <p className="text-gray-600 mt-1">Please provide your personal information</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm mb-8">
        <div className="flex items-center mb-4">
          <div className="bg-blue-50 p-2 rounded-md mr-3">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <p className="text-gray-500 text-sm">Your basic contact details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <Input
              id="firstName"
              placeholder="Enter your first name"
              value={data.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className={errors.firstName ? 'border-red-500' : ''}
            />
            {errors.firstName && (
              <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <Input
              id="lastName"
              placeholder="Enter your last name"
              value={data.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className={errors.lastName ? 'border-red-500' : ''}
            />
            {errors.lastName && (
              <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>Email Address</span>
            </div>
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">We'll never share your email with anyone else.</p>
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

export default BasicDetailsForm;

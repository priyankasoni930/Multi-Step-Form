
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Briefcase, Plus, Calendar, Trash2 } from 'lucide-react';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ExperienceData, WorkExperiencePosition } from '@/types/form';

interface ExperienceFormProps {
  data: ExperienceData;
  onChange: (data: ExperienceData) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSaveDraft: () => void;
}

const workExperienceSchema = z.object({
  title: z.string().min(1, { message: "Job title is required" }),
  company: z.string().min(1, { message: "Company name is required" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().optional(),
  current: z.boolean(),
  description: z.string().min(1, { message: "Job description is required" })
});

const experienceSchema = z.object({
  positions: z.array(workExperienceSchema).min(1)
});

const emptyPosition: WorkExperiencePosition = {
  title: '',
  company: '',
  startDate: '',
  endDate: '',
  current: false,
  description: ''
};

const ExperienceForm: React.FC<ExperienceFormProps> = ({ 
  data, 
  onChange,
  onNext, 
  onPrevious, 
  onSaveDraft 
}) => {
  const [errors, setErrors] = React.useState<Record<string, any>>({});

  const handleAddPosition = () => {
    onChange({
      ...data,
      positions: [...data.positions, { ...emptyPosition }]
    });
  };

  const handleRemovePosition = (index: number) => {
    if (data.positions.length > 1) {
      const updatedPositions = [...data.positions];
      updatedPositions.splice(index, 1);
      onChange({
        ...data,
        positions: updatedPositions
      });
    }
  };

  const handlePositionChange = (index: number, field: keyof WorkExperiencePosition, value: any) => {
    const updatedPositions = [...data.positions];
    
    // Special handling for the "current" checkbox
    if (field === 'current' && value === true) {
      updatedPositions[index] = {
        ...updatedPositions[index],
        [field]: value,
        endDate: '' // Clear end date when "current" is checked
      };
    } else {
      updatedPositions[index] = {
        ...updatedPositions[index],
        [field]: value
      };
    }
    
    onChange({
      ...data,
      positions: updatedPositions
    });
  };

  const validateForm = () => {
    try {
      experienceSchema.parse(data);
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
        <h1 className="text-2xl font-bold text-gray-800">Experience</h1>
        <p className="text-gray-600 mt-1">Tell us about your professional experience</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm mb-8">
        <div className="flex items-center mb-4">
          <div className="bg-blue-50 p-2 rounded-md mr-3">
            <Briefcase className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Work Experience</h2>
            <p className="text-gray-500 text-sm">Your professional history</p>
          </div>
        </div>

        {data.positions.map((position, index) => (
          <div key={index} className="mb-8 pb-6 border-b last:border-b-0 last:pb-0">
            {index > 0 && (
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-medium">Position {index + 1}</h3>
                <Button
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleRemovePosition(index)}
                  className="text-red-500 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor={`jobTitle-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <Input
                  id={`jobTitle-${index}`}
                  placeholder="e.g. Senior Legal Counsel"
                  value={position.title}
                  onChange={(e) => handlePositionChange(index, 'title', e.target.value)}
                  className={errors[`positions.${index}.title`] ? 'border-red-500' : ''}
                />
                {errors[`positions.${index}.title`] && (
                  <p className="text-xs text-red-500 mt-1">{errors[`positions.${index}.title`]}</p>
                )}
              </div>

              <div>
                <label htmlFor={`company-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <Input
                  id={`company-${index}`}
                  placeholder="e.g. Smith & Associates"
                  value={position.company}
                  onChange={(e) => handlePositionChange(index, 'company', e.target.value)}
                  className={errors[`positions.${index}.company`] ? 'border-red-500' : ''}
                />
                {errors[`positions.${index}.company`] && (
                  <p className="text-xs text-red-500 mt-1">{errors[`positions.${index}.company`]}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor={`startDate-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id={`startDate-${index}`}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !position.startDate && "text-muted-foreground",
                        errors[`positions.${index}.startDate`] ? 'border-red-500' : ''
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {position.startDate ? format(new Date(position.startDate), "PPP") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={position.startDate ? new Date(position.startDate) : undefined}
                      onSelect={(date) => handlePositionChange(index, 'startDate', date ? date.toISOString() : '')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors[`positions.${index}.startDate`] && (
                  <p className="text-xs text-red-500 mt-1">{errors[`positions.${index}.startDate`]}</p>
                )}
              </div>

              <div>
                <div className="flex justify-between">
                  <label htmlFor={`endDate-${index}`} className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id={`current-${index}`} 
                      checked={position.current}
                      onCheckedChange={(checked) => handlePositionChange(index, 'current', checked === true)}
                    />
                    <label 
                      htmlFor={`current-${index}`}
                      className="text-sm text-gray-600"
                    >
                      Current position
                    </label>
                  </div>
                </div>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id={`endDate-${index}`}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !position.endDate && "text-muted-foreground",
                        errors[`positions.${index}.endDate`] ? 'border-red-500' : ''
                      )}
                      disabled={position.current}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {position.endDate ? format(new Date(position.endDate), "PPP") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={position.endDate ? new Date(position.endDate) : undefined}
                      onSelect={(date) => handlePositionChange(index, 'endDate', date ? date.toISOString() : '')}
                      initialFocus
                      disabled={(date) => position.startDate ? date < new Date(position.startDate) : false}
                    />
                  </PopoverContent>
                </Popover>
                {errors[`positions.${index}.endDate`] && (
                  <p className="text-xs text-red-500 mt-1">{errors[`positions.${index}.endDate`]}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor={`description-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
              <Textarea
                id={`description-${index}`}
                placeholder="Describe your responsibilities and achievements..."
                value={position.description}
                onChange={(e) => handlePositionChange(index, 'description', e.target.value)}
                className={cn("min-h-32", errors[`positions.${index}.description`] ? 'border-red-500' : '')}
              />
              {errors[`positions.${index}.description`] && (
                <p className="text-xs text-red-500 mt-1">{errors[`positions.${index}.description`]}</p>
              )}
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="mt-2 w-full md:w-auto"
          onClick={handleAddPosition}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add another position
        </Button>
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

export default ExperienceForm;

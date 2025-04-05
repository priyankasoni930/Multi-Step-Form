
import React from 'react';
import { FormSteps } from '@/types/form';
import { useIsMobile } from '@/hooks/use-mobile';

interface FormStepperProps {
  currentStep: FormSteps;
  steps: Array<{
    id: FormSteps;
    title: string;
  }>;
}

const FormStepper: React.FC<FormStepperProps> = ({ currentStep, steps }) => {
  const isMobile = useIsMobile();
  
  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep);
  };

  const isStepCompleted = (stepId: FormSteps) => {
    const currentIndex = getCurrentStepIndex();
    const stepIndex = steps.findIndex(step => step.id === stepId);
    return stepIndex < currentIndex;
  };

  const isCurrentStep = (stepId: FormSteps) => {
    return stepId === currentStep;
  };

  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-full flex items-center justify-center transition-all duration-500 transform ${
                  isStepCompleted(step.id)
                    ? 'bg-green-500 text-white scale-105'
                    : isCurrentStep(step.id)
                    ? 'bg-[#1A1F2C] text-white scale-110'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                <span className={isMobile ? 'text-xs' : 'text-sm'}>{index + 1}</span>
              </div>
              <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} mt-2 text-center transition-all duration-300 ${
                isCurrentStep(step.id) ? 'font-medium text-[#1A1F2C]' : 'text-gray-500'
              }`}>
                {isMobile && step.title.length > 10 ? step.title.substring(0, 10) + '...' : step.title}
              </span>
            </div>
            
            {/* Connector Line (except after the last step) */}
            {index < steps.length - 1 && (
              <div 
                className={`flex-1 ${isMobile ? 'h-0.5 mx-0.5' : 'h-1 mx-2'} transition-all duration-700 ${
                  isStepCompleted(steps[index + 1].id) || (isStepCompleted(step.id) && isCurrentStep(steps[index + 1].id))
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default FormStepper;

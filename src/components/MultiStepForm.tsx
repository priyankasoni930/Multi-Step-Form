import React, { useState, useEffect } from 'react';
import { FormData, FormSteps, QualificationData, CertificationData, BarRegistrationData } from '@/types/form';
import FormStepper from './FormStepper';
import ProfessionalDetailsForm from './ProfessionalDetailsForm';
import BasicDetailsForm from './BasicDetailsForm';
import ExperienceForm from './ExperienceForm';
import IdentityVerificationForm from './IdentityVerificationForm';
import VerificationStatus from './VerificationStatus';
import { useToast } from '@/hooks/use-toast';

const initialQualification: QualificationData = {
  degreeType: '',
  institutionName: '',
  graduationYear: '',
  document: { file: null, preview: null }
};

const initialCertification: CertificationData = {
  name: '',
  issuingBody: '',
  date: '',
  document: { file: null, preview: null }
};

const initialBarRegistration: BarRegistrationData = {
  association: '',
  licenseNumber: '',
  jurisdiction: '',
  completionYear: '',
  document: { file: null, preview: null }
};

const initialFormData: FormData = {
  basicDetails: {
    firstName: '',
    lastName: '',
    email: ''
  },
  professionalDetails: {
    qualifications: initialQualification,
    certifications: [initialCertification],
    barRegistration: initialBarRegistration
  },
  experience: {
    positions: [{
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }]
  },
  identityVerification: {
    idType: '',
    idNumber: '',
    expiryDate: '',
    document: { file: null, preview: null }
  }
};

const steps = [
  { id: 'basicDetails' as FormSteps, title: 'Basic Details' },
  { id: 'professionalDetails' as FormSteps, title: 'Professional Details' },
  { id: 'experience' as FormSteps, title: 'Experience' },
  { id: 'identityVerification' as FormSteps, title: 'Identity Verification' },
  { id: 'verificationStatus' as FormSteps, title: 'Verification Status' }
];

const STORAGE_KEY = 'lexi_ai_form_data';
const FILES_STORAGE_KEY = 'lexi_ai_form_files';

const MultiStepForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState<FormSteps>('basicDetails');
  const [animationDirection, setAnimationDirection] = useState<'forward' | 'backward'>('forward');
  const { toast } = useToast();

  // Load saved form data and files from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    const savedFiles = localStorage.getItem(FILES_STORAGE_KEY);
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        
        // If we have saved file previews, restore them
        if (savedFiles) {
          const fileRefs = JSON.parse(savedFiles);
          
          // We need to make deep copy to avoid mutating the state directly
          const updatedFormData = { ...parsedData };
          
          // Restore qualification document preview
          if (fileRefs.qualifications && fileRefs.qualifications.preview) {
            updatedFormData.professionalDetails.qualifications.document.preview = fileRefs.qualifications.preview;
          }
          
          // Restore bar registration document preview
          if (fileRefs.barRegistration && fileRefs.barRegistration.preview) {
            updatedFormData.professionalDetails.barRegistration.document.preview = fileRefs.barRegistration.preview;
          }
          
          // Restore certifications document previews
          if (fileRefs.certifications && fileRefs.certifications.length) {
            // Make sure we only restore previews for certifications that still exist
            // This handles the case where certifications have been removed
            fileRefs.certifications.forEach((cert: any, index: number) => {
              if (index < updatedFormData.professionalDetails.certifications.length && cert.preview) {
                updatedFormData.professionalDetails.certifications[index].document.preview = cert.preview;
              }
            });
          }
          
          // Restore identity verification document preview
          if (fileRefs.identityVerification && fileRefs.identityVerification.preview) {
            updatedFormData.identityVerification.document.preview = fileRefs.identityVerification.preview;
          }
          
          setFormData(updatedFormData);
        }
        
        // Show toast notification
        toast({
          title: "Draft loaded",
          description: "Your previously saved form data has been restored",
        });
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
  }, [toast]);

  const handleNext = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setAnimationDirection('forward');
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setAnimationDirection('backward');
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const handleSaveDraft = () => {
    // Create a safe-to-serialize copy of formData (without File objects)
    const formDataToSave = JSON.stringify(formData, (key, value) => {
      // Skip actual file objects when serializing
      if (key === 'file' && value instanceof File) {
        return null;
      }
      return value;
    });
    
    // Save file previews separately to restore them later
    const fileRefs = {
      qualifications: {
        preview: formData.professionalDetails.qualifications.document.preview
      },
      barRegistration: {
        preview: formData.professionalDetails.barRegistration.document.preview
      },
      certifications: formData.professionalDetails.certifications.map(cert => ({
        preview: cert.document.preview
      })),
      identityVerification: {
        preview: formData.identityVerification.document.preview
      }
    };
    
    localStorage.setItem(STORAGE_KEY, formDataToSave);
    localStorage.setItem(FILES_STORAGE_KEY, JSON.stringify(fileRefs));
    
    toast({
      title: "Draft saved",
      description: "Your form progress has been saved",
    });
  };

  const handleBasicDetailsChange = (data: FormData['basicDetails']) => {
    setFormData({
      ...formData,
      basicDetails: data
    });
  };

  const handleProfessionalDetailsChange = (data: FormData['professionalDetails']) => {
    setFormData({
      ...formData,
      professionalDetails: data
    });
  };

  const handleExperienceChange = (data: FormData['experience']) => {
    setFormData({
      ...formData,
      experience: data
    });
  };

  const handleIdentityVerificationChange = (data: FormData['identityVerification']) => {
    setFormData({
      ...formData,
      identityVerification: data
    });
  };

  const getFormAnimation = () => {
    return animationDirection === 'forward' ? 'animate-fade-in' : 'animate-fade-in';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-[#1A1F2C]">LeXi Ai</h1>
      </div>

      <FormStepper currentStep={currentStep} steps={steps} />

      <div className={getFormAnimation()}>
        {currentStep === 'basicDetails' && (
          <BasicDetailsForm
            data={formData.basicDetails}
            onChange={handleBasicDetailsChange}
            onNext={handleNext}
            onSaveDraft={handleSaveDraft}
          />
        )}

        {currentStep === 'professionalDetails' && (
          <ProfessionalDetailsForm
            data={formData.professionalDetails}
            onChange={handleProfessionalDetailsChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSaveDraft={handleSaveDraft}
          />
        )}

        {currentStep === 'experience' && (
          <ExperienceForm 
            data={formData.experience}
            onChange={handleExperienceChange}
            onNext={handleNext} 
            onPrevious={handlePrevious} 
            onSaveDraft={handleSaveDraft} 
          />
        )}

        {currentStep === 'identityVerification' && (
          <IdentityVerificationForm 
            data={formData.identityVerification}
            onChange={handleIdentityVerificationChange}
            onNext={handleNext} 
            onPrevious={handlePrevious} 
            onSaveDraft={handleSaveDraft} 
          />
        )}

        {currentStep === 'verificationStatus' && (
          <VerificationStatus 
            formData={formData}
          />
        )}
      </div>
    </div>
  );
};

export default MultiStepForm;

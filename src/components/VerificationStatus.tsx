
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, User, Briefcase, GraduationCap, Scale, Award, Shield } from 'lucide-react';
import { FormData } from '@/types/form';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';

interface VerificationStatusProps {
  formData: FormData;
}

const VerificationStatus: React.FC<VerificationStatusProps> = ({ formData }) => {
  const isMobile = useIsMobile();
  
  const handleViewApplication = () => {
    // This would show a modal or navigate to an application details page
    alert('View Application clicked');
  };

  const handleGoToDashboard = () => {
    // This would navigate to the dashboard
    alert('Go to Dashboard clicked');
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg animate-fade-in">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Verification Status</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Your application status and next steps</p>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-100 shadow-sm mb-6 sm:mb-8 flex flex-col items-center justify-center py-8 sm:py-12">
        <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mb-4 animate-[pulse_2s_ease-in-out_infinite]" />
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 animate-fade-in">Application Submitted</h2>
        <p className="text-sm sm:text-base text-gray-600 text-center max-w-md mb-6 sm:mb-8 animate-fade-in">
          Thank you, {formData.basicDetails.firstName}! Your application has been submitted successfully. 
          We will review your information and documents shortly.
        </p>
        
        <div className="w-full max-w-md bg-gray-50 p-3 sm:p-4 rounded-lg mb-6 sm:mb-8 animate-fade-in">
          <h3 className="text-sm sm:text-md font-medium mb-3">Application Summary</h3>
          
          <div className="space-y-3 sm:space-y-4">
            {[
              { 
                icon: <User className="h-4 w-4 text-blue-600" />, 
                title: "Personal Information",
                content: `${formData.basicDetails.firstName} ${formData.basicDetails.lastName} | ${formData.basicDetails.email}`,
                delay: 0
              },
              {
                icon: <GraduationCap className="h-4 w-4 text-blue-600" />,
                title: "Education",
                content: `${formData.professionalDetails.qualifications.degreeType} | ${formData.professionalDetails.qualifications.institutionName} | ${formData.professionalDetails.qualifications.graduationYear}`,
                delay: 100
              },
              {
                icon: <Award className="h-4 w-4 text-blue-600" />,
                title: "Certifications",
                content: `${formData.professionalDetails.certifications.length} certification(s) submitted`,
                delay: 200
              },
              {
                icon: <Scale className="h-4 w-4 text-blue-600" />,
                title: "Bar Registration",
                content: `${formData.professionalDetails.barRegistration.association} | ${formData.professionalDetails.barRegistration.jurisdiction} | License #${formData.professionalDetails.barRegistration.licenseNumber}`,
                delay: 300
              },
              {
                icon: <Briefcase className="h-4 w-4 text-blue-600" />,
                title: "Experience",
                content: `${formData.experience.positions.length} position(s) | Latest: ${formData.experience.positions[0].title} at ${formData.experience.positions[0].company}`,
                delay: 400
              },
              {
                icon: <Shield className="h-4 w-4 text-blue-600" />,
                title: "Identity Verification",
                content: `${formData.identityVerification.idType} | ID #${formData.identityVerification.idNumber.slice(0, 4)}... | Expires: ${formData.identityVerification.expiryDate ? format(new Date(formData.identityVerification.expiryDate), "PP") : 'N/A'}`,
                delay: 500
              }
            ].map((item, index) => (
              <div key={index} className={`flex items-start transition-all duration-500 transform translate-y-0 opacity-100`} style={{animationDelay: `${item.delay}ms`}}>
                <div className="bg-blue-50 p-1.5 rounded-md mr-3 flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-medium">{item.title}</h4>
                  <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                    {isMobile && item.content.length > 30 ? item.content.substring(0, 30) + '...' : item.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg mb-5 sm:mb-6 w-full max-w-md animate-fade-in">
          <h3 className="text-xs sm:text-sm font-medium text-yellow-800 mb-1">Next Steps</h3>
          <p className="text-[10px] sm:text-xs text-yellow-800">
            Our team will review your application within 1-2 business days. 
            You will receive an email notification once the verification process is complete.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-md animate-fade-in">
          <Button
            variant="outline"
            className="transition-transform duration-300 hover:scale-105 w-full"
            onClick={handleViewApplication}
          >
            View Application
          </Button>
          <Button
            className="bg-gray-900 text-white transition-transform duration-300 hover:scale-105 w-full"
            onClick={handleGoToDashboard}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerificationStatus;

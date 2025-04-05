
export interface FormFile {
  file: File | null;
  preview: string | null;
}

export interface QualificationData {
  degreeType: string;
  institutionName: string;
  graduationYear: string;
  document: FormFile;
}

export interface CertificationData {
  name: string;
  issuingBody: string;
  date: string;
  document: FormFile;
}

export interface BarRegistrationData {
  association: string;
  licenseNumber: string;
  jurisdiction: string;
  completionYear: string;
  document: FormFile;
}

export interface ProfessionalDetailsData {
  qualifications: QualificationData;
  certifications: CertificationData[];
  barRegistration: BarRegistrationData;
}

export interface WorkExperiencePosition {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface ExperienceData {
  positions: WorkExperiencePosition[];
}

export interface IdentityVerificationData {
  idType: string;
  idNumber: string;
  expiryDate: string;
  document: FormFile;
}

export interface FormData {
  basicDetails: {
    firstName: string;
    lastName: string;
    email: string;
  };
  professionalDetails: ProfessionalDetailsData;
  experience: ExperienceData;
  identityVerification: IdentityVerificationData;
}

export type FormSteps = 'basicDetails' | 'professionalDetails' | 'experience' | 'identityVerification' | 'verificationStatus';

import React, { useState } from "react";
import {
  ProfessionalDetailsData,
  FormFile,
  CertificationData,
} from "@/types/form";
import { z } from "zod";
import { Calendar, Plus, X } from "lucide-react";
import FileUpload from "./FileUpload";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ProfessionalDetailsFormProps {
  data: ProfessionalDetailsData;
  onChange: (data: ProfessionalDetailsData) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSaveDraft: () => void;
}

// Generate years from 1950 to current year
const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1950; year--) {
    years.push(year.toString());
  }
  return years;
};

const years = generateYears();

// Form validation schema
const fileSchema = z.object({
  file: z
    .instanceof(File)
    .nullable()
    .refine((file) => file !== null, { message: "Document is required" }),
  preview: z.string().nullable(),
});

const qualificationSchema = z.object({
  degreeType: z.string().min(1, { message: "Degree type is required" }),
  institutionName: z
    .string()
    .min(1, { message: "Institution name is required" }),
  graduationYear: z.string().min(1, { message: "Graduation year is required" }),
  document: fileSchema,
});

const certificationSchema = z.object({
  name: z.string().min(1, { message: "Certification name is required" }),
  issuingBody: z.string().min(1, { message: "Issuing body is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  document: fileSchema,
});

const barRegistrationSchema = z.object({
  association: z.string().min(1, { message: "Bar association is required" }),
  licenseNumber: z.string().min(1, { message: "License number is required" }),
  jurisdiction: z.string().min(1, { message: "Jurisdiction is required" }),
  completionYear: z.string().min(1, { message: "Completion year is required" }),
  document: fileSchema,
});

const professionalDetailsSchema = z.object({
  qualifications: qualificationSchema,
  certifications: z
    .array(certificationSchema)
    .min(1, { message: "At least one certification is required" }),
  barRegistration: barRegistrationSchema,
});

const degreeTypes = [
  "Bachelor of Laws (LLB)",
  "Juris Doctor (JD)",
  "Master of Laws (LLM)",
  "Doctor of Juridical Science (SJD)",
  "PhD in Law",
];
const barAssociations = [
  "American Bar Association",
  "State Bar of California",
  "New York State Bar Association",
  "Florida Bar Association",
  "Texas Bar Association",
];
const states = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

const emptyFile: FormFile = { file: null, preview: null };

const ProfessionalDetailsForm: React.FC<ProfessionalDetailsFormProps> = ({
  data,
  onChange,
  onNext,
  onPrevious,
  onSaveDraft,
}) => {
  const [errors, setErrors] = useState<Record<string, any>>({});

  const handleAddCertification = () => {
    const newCertification: CertificationData = {
      name: "",
      issuingBody: "",
      date: "",
      document: { file: null, preview: null },
    };

    onChange({
      ...data,
      certifications: [...data.certifications, newCertification],
    });
  };

  const handleRemoveCertification = (index: number) => {
    // Don't allow removing if there's only one certification
    if (data.certifications.length <= 1) return;

    const updatedCertifications = [...data.certifications];
    updatedCertifications.splice(index, 1);

    onChange({
      ...data,
      certifications: updatedCertifications,
    });
  };

  const handleCertificationChange = (
    index: number,
    field: keyof CertificationData,
    value: any
  ) => {
    const updatedCertifications = [...data.certifications];
    updatedCertifications[index] = {
      ...updatedCertifications[index],
      [field]: value,
    };

    onChange({
      ...data,
      certifications: updatedCertifications,
    });
  };

  const validateForm = () => {
    try {
      professionalDetailsSchema.parse(data);
      setErrors({});
      return true;
    } catch (error: any) {
      if (error.errors) {
        const formattedErrors: Record<string, any> = {};
        error.errors.forEach((err: any) => {
          const path = err.path.join(".");
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
        <h1 className="text-2xl font-bold text-[#1A1F2C]">
          Professional Details
        </h1>
        <p className="text-gray-600 mt-1">
          Tell us about your qualifications so we can connect you with our
          clients
        </p>
      </div>

      {/* Qualifications Section */}
      <div className="mb-8 bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="bg-[#f0f7f7] p-2 rounded-md mr-3">
            <svg
              className="h-5 w-5 text-[#1A1F2C]"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 10L12 5L3 10L12 15L21 10Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.5 12.5V17.5C7.5 17.5 9.5 19 12 19C14.5 19 16.5 17.5 16.5 17.5V12.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#1A1F2C]">
              Qualifications<span className="text-red-500">*</span>
            </h2>
            <p className="text-gray-500 text-sm">
              Your educational background and degrees
            </p>
          </div>
        </div>

        {/* Degree Type - Full Width */}
        <div className="mb-4">
          <label
            htmlFor="degreeType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Degree Type
          </label>
          <Select
            value={data.qualifications.degreeType}
            onValueChange={(value) =>
              onChange({
                ...data,
                qualifications: { ...data.qualifications, degreeType: value },
              })
            }
          >
            <SelectTrigger
              id="degreeType"
              className={cn(
                "border border-gray-300 rounded-md",
                errors["qualifications.degreeType"] ? "border-red-500" : ""
              )}
            >
              <SelectValue placeholder="Select degree type" />
            </SelectTrigger>
            <SelectContent>
              {degreeTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors["qualifications.degreeType"] && (
            <p className="text-xs text-red-500 mt-1">
              {errors["qualifications.degreeType"]}
            </p>
          )}
        </div>

        {/* Institution Name and Graduation Year - Half Width Each */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="institutionName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Institution Name
            </label>
            <Input
              id="institutionName"
              placeholder="e.g. Harvard Law School"
              value={data.qualifications.institutionName}
              onChange={(e) =>
                onChange({
                  ...data,
                  qualifications: {
                    ...data.qualifications,
                    institutionName: e.target.value,
                  },
                })
              }
              className={cn(
                "border border-gray-300 rounded-md",
                errors["qualifications.institutionName"] ? "border-red-500" : ""
              )}
            />
            {errors["qualifications.institutionName"] && (
              <p className="text-xs text-red-500 mt-1">
                {errors["qualifications.institutionName"]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="graduationYear"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Graduation Year
            </label>
            <Select
              value={data.qualifications.graduationYear}
              onValueChange={(value) =>
                onChange({
                  ...data,
                  qualifications: {
                    ...data.qualifications,
                    graduationYear: value,
                  },
                })
              }
            >
              <SelectTrigger
                id="graduationYear"
                className={cn(
                  "border border-gray-300 rounded-md",
                  errors["qualifications.graduationYear"]
                    ? "border-red-500"
                    : ""
                )}
              >
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors["qualifications.graduationYear"] && (
              <p className="text-xs text-red-500 mt-1">
                {errors["qualifications.graduationYear"]}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Degree Document
          </label>
          <FileUpload
            id="degreeDocument"
            value={data.qualifications.document}
            onChange={(file) =>
              onChange({
                ...data,
                qualifications: { ...data.qualifications, document: file },
              })
            }
            error={errors["qualifications.document.file"]}
          />
        </div>
      </div>

      {/* Certifications Section */}
      <div className="mb-8 bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="bg-[#f5f0fa] p-2 rounded-md mr-3">
            <svg
              className="h-5 w-5 text-[#1A1F2C]"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#1A1F2C]">
              Certifications
            </h2>
            <p className="text-gray-500 text-sm">
              Additional professional certifications
            </p>
          </div>
        </div>

        {data.certifications.map((certification, index) => (
          <div
            key={index}
            className="mb-8 border-b pb-6 last:border-b-0 last:pb-0 relative"
          >
            {/* Remove button for additional certifications */}
            {index > 0 && (
              <button
                type="button"
                onClick={() => handleRemoveCertification(index)}
                className="absolute top-0 right-0 text-gray-400 hover:text-red-500"
                aria-label="Remove certification"
              >
                <X size={18} />
              </button>
            )}

            {/* Certification Name and Issuing Body - Half Width Each */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor={`certificationName-${index}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Certification Name
                </label>
                <Input
                  id={`certificationName-${index}`}
                  placeholder="e.g. Certified Privacy Professional"
                  value={certification.name}
                  onChange={(e) =>
                    handleCertificationChange(index, "name", e.target.value)
                  }
                  className={cn(
                    "border border-gray-300 rounded-md",
                    errors[`certifications.${index}.name`]
                      ? "border-red-500"
                      : ""
                  )}
                />
                {errors[`certifications.${index}.name`] && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors[`certifications.${index}.name`]}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor={`issuingBody-${index}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Issuing Body
                </label>
                <Input
                  id={`issuingBody-${index}`}
                  placeholder="e.g. International Association of Privacy Professionals"
                  value={certification.issuingBody}
                  onChange={(e) =>
                    handleCertificationChange(
                      index,
                      "issuingBody",
                      e.target.value
                    )
                  }
                  className={cn(
                    "border border-gray-300 rounded-md",
                    errors[`certifications.${index}.issuingBody`]
                      ? "border-red-500"
                      : ""
                  )}
                />
                {errors[`certifications.${index}.issuingBody`] && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors[`certifications.${index}.issuingBody`]}
                  </p>
                )}
              </div>
            </div>

            {/* Certification Date - Half Width */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor={`certificationDate-${index}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Certification Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border border-gray-300 rounded-md",
                        !certification.date && "text-muted-foreground",
                        errors[`certifications.${index}.date`]
                          ? "border-red-500"
                          : ""
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {certification.date ? (
                        format(new Date(certification.date), "PPP")
                      ) : (
                        <span>Select date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={
                        certification.date
                          ? new Date(certification.date)
                          : undefined
                      }
                      onSelect={(date) =>
                        handleCertificationChange(
                          index,
                          "date",
                          date ? date.toISOString() : ""
                        )
                      }
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors[`certifications.${index}.date`] && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors[`certifications.${index}.date`]}
                  </p>
                )}
              </div>
              <div></div> {/* Empty div to maintain grid layout */}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Certificate Document
              </label>
              <FileUpload
                id={`certificationDocument-${index}`}
                value={certification.document}
                onChange={(file) =>
                  handleCertificationChange(index, "document", file)
                }
                error={errors[`certifications.${index}.document.file`]}
              />
            </div>
          </div>
        ))}

        <div className="mt-4 flex items-center">
          <div
            className="flex items-center cursor-pointer group"
            onClick={handleAddCertification}
          >
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 group-hover:bg-gray-200 mr-2">
              <Plus className="h-4 w-4 text-gray-600" />
            </div>
            <span className="text-sm text-gray-600">
              Add another certification
            </span>
          </div>
        </div>
      </div>

      {/* Bar Association Registration */}
      <div className="mb-8 bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="bg-[#f0f7f0] p-2 rounded-md mr-3">
            <svg
              className="h-5 w-5 text-[#1A1F2C]"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#1A1F2C]">
              Bar Association Registration
            </h2>
            <p className="text-gray-500 text-sm">
              Your professional licensing information
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="barAssociation"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Bar Association
            </label>
            <Select
              value={data.barRegistration.association}
              onValueChange={(value) =>
                onChange({
                  ...data,
                  barRegistration: {
                    ...data.barRegistration,
                    association: value,
                  },
                })
              }
            >
              <SelectTrigger
                id="barAssociation"
                className={cn(
                  "border border-gray-300 rounded-md",
                  errors["barRegistration.association"] ? "border-red-500" : ""
                )}
              >
                <SelectValue placeholder="Select bar association" />
              </SelectTrigger>
              <SelectContent>
                {barAssociations.map((association) => (
                  <SelectItem key={association} value={association}>
                    {association}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors["barRegistration.association"] && (
              <p className="text-xs text-red-500 mt-1">
                {errors["barRegistration.association"]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="licenseNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              License/Bar Number
            </label>
            <Input
              id="licenseNumber"
              placeholder="e.g. CA123456"
              value={data.barRegistration.licenseNumber}
              onChange={(e) =>
                onChange({
                  ...data,
                  barRegistration: {
                    ...data.barRegistration,
                    licenseNumber: e.target.value,
                  },
                })
              }
              className={cn(
                "border border-gray-300 rounded-md",
                errors["barRegistration.licenseNumber"] ? "border-red-500" : ""
              )}
            />
            {errors["barRegistration.licenseNumber"] && (
              <p className="text-xs text-red-500 mt-1">
                {errors["barRegistration.licenseNumber"]}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="jurisdiction"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Jurisdiction/State
            </label>
            <Select
              value={data.barRegistration.jurisdiction}
              onValueChange={(value) =>
                onChange({
                  ...data,
                  barRegistration: {
                    ...data.barRegistration,
                    jurisdiction: value,
                  },
                })
              }
            >
              <SelectTrigger
                id="jurisdiction"
                className={cn(
                  "border border-gray-300 rounded-md",
                  errors["barRegistration.jurisdiction"] ? "border-red-500" : ""
                )}
              >
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors["barRegistration.jurisdiction"] && (
              <p className="text-xs text-red-500 mt-1">
                {errors["barRegistration.jurisdiction"]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="completionYear"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Completion Year
            </label>
            <Select
              value={data.barRegistration.completionYear || ""}
              onValueChange={(value) =>
                onChange({
                  ...data,
                  barRegistration: {
                    ...data.barRegistration,
                    completionYear: value,
                  },
                })
              }
            >
              <SelectTrigger
                id="completionYear"
                className={cn(
                  "border border-gray-300 rounded-md",
                  errors["barRegistration.completionYear"]
                    ? "border-red-500"
                    : ""
                )}
              >
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors["barRegistration.completionYear"] && (
              <p className="text-xs text-red-500 mt-1">
                {errors["barRegistration.completionYear"]}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Proof Document
          </label>
          <FileUpload
            id="barProofDocument"
            value={data.barRegistration.document}
            onChange={(file) =>
              onChange({
                ...data,
                barRegistration: { ...data.barRegistration, document: file },
              })
            }
            error={errors["barRegistration.document.file"]}
          />
        </div>
      </div>

      {/* Form Navigation */}
      <div className="flex flex-wrap justify-between mt-8">
        <Button
          type="button"
          variant="outline"
          className="mb-2 sm:mb-0 border border-gray-300 rounded-md text-[#1A1F2C] hover:bg-gray-50"
          onClick={onSaveDraft}
        >
          Save Draft
        </Button>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="mb-2 sm:mb-0 border border-gray-300 rounded-md text-[#1A1F2C] hover:bg-gray-50"
            onClick={onPrevious}
          >
            Skip
          </Button>

          <Button
            type="button"
            className="bg-[#001F2C] text-white hover:bg-[#001F2C]/90 rounded-md"
            onClick={handleSubmit}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDetailsForm;

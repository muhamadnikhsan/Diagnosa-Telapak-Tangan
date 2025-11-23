export enum Gender {
  MALE = 'Laki-laki',
  FEMALE = 'Perempuan'
}

export interface PatientData {
  name: string;
  age: string;
  gender: Gender;
  job: string;
  complaint: string;
}

export interface AnalysisRequest {
  patientData: PatientData;
  palmImage: string | null; // Base64
  backImage: string | null; // Base64
}

export interface ImageUploadState {
  file: File | null;
  preview: string | null;
}
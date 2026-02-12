
export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
  INTERVIEWER = 'INTERVIEWER'
}

export enum PracticeType {
  EXAM = 'EXAM',
  INTERVIEW = 'INTERVIEW',
  SUBSCRIPTION = 'SUBSCRIPTION'
}

export interface PerformanceScore {
  id?: string;
  userId: string;
  title: string;
  score: number;
  date: number;
  category: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  professionalSector?: string;
  professionalField?: string;
  institution?: string;
  experienceYears?: string;
  skills?: string[];
  qualification?: string;
  createdAt: number;
}

export interface CareerField {
  id: string;
  name: string;
  description: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  type: PracticeType;
  features: string[];
  billingCycle?: 'once' | 'monthly' | 'free';
}

export interface PracticeSession {
  id?: string;
  userId: string;
  fullName: string;
  email: string;
  institution: string;
  sector: string;
  field: string;
  natureOfPractice: string;
  applicationType?: 'Intern' | 'Professional';
  practiceCategory: string;
  date: string;
  time: string;
  planId?: string;
  genderPreference?: 'No Preference' | 'Male' | 'Female';
  questionType?: 'MCQ' | 'Theory';
  examStandard?: 'Local Standard' | 'International Standard';
  applyingFor?: string;
  experienceYears?: string;
  skills?: string[];
  qualification?: string;
  // Added 'WAITING_LIST' to the status union type
  status: 'PENDING_PAYMENT' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'WAITING_LIST';
  paid: boolean;
  createdAt: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
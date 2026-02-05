
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

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  professionalField?: string;
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
  billingCycle?: 'once' | 'monthly';
}

export interface PracticeSession {
  id?: string;
  fullName: string;
  email: string;
  institution: string;
  field: string;
  customField?: string;
  natureOfPractice: string;
  practiceCategory: string;
  date: string;
  time: string;
  planId: string;
  // Professional Profile
  bio?: string;
  strengths?: string;
  weaknesses?: string;
  goals?: string;
  // New Enhanced Fields
  applyingFor?: string;
  experienceYears?: string;
  skills?: string[];
  qualification?: string;
  status: 'PENDING' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  paid: boolean;
  createdAt: number;
}

export interface Feedback {
  score: number;
  totalPossible: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string;
  recordedAt: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

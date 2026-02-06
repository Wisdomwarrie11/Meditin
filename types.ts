
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
  billingCycle?: 'once' | 'monthly';
}

export interface PracticeSession {
  id?: string;
  userId: string;
  fullName: string;
  email: string;
  institution: string;
  field: string;
  customField?: string;
  natureOfPractice: string;
  practiceCategory: string;
  date: string;
  time: string;
  planId?: string;
  bio?: string;
  strengths?: string;
  weaknesses?: string;
  goals?: string;
  applyingFor?: string;
  experienceYears?: string;
  skills?: string[];
  qualification?: string;
  status: 'PENDING_PAYMENT' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  paid: boolean;
  createdAt: number;
}

// Added Question interface to support SAMPLE_QUESTIONS in constants.tsx
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

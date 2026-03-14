
import React from 'react';
import { Zap, ShieldCheck, Star } from 'lucide-react';
import { CareerField, PricingPlan, PracticeType, Question } from './types';

export const SECTOR_MAPPING: Record<string, string[]> = {
  'Finance': ['Accountant', 'Financial Analyst', 'Banker', 'Auditor'],
  'Health': ['Medical Doctor', 'Nurse', 'Radiographer', 'Pharmacist'],
  'Technology': ['Frontend', 'Backend Dev', 'Fullstack Dev', 'Data Scientist', 'Product Manager', 'UI/UX Designer'],
};

export const SECTORS = Object.keys(SECTOR_MAPPING);

// Pricing Multipliers (Successive 25% increase)
export const SECTOR_PRICING_MULTIPLIERS: Record<string, number> = {
  'Finance': 0.85, // 1.25 * 1.25
  'Health': 0.85, // 1.25^3
  'Tech': 2.44140625, // 1.25^4
};

export const BASE_PRICES = {
  BASIC: 4800,
  INTERMEDIATE: 7600,
  ADVANCED: 14200,
  FREE_EXAM: 0,
  PAID_EXAM: 3000
};

export const GET_PLAN_PRICE = (planType: string, sector: string) => {
  if (planType === 'FREE_EXAM') return 0;
  if (planType === 'PAID_EXAM') return 3000;
  
  const base = BASE_PRICES[planType as keyof typeof BASE_PRICES] || 0;
  const multiplier = SECTOR_PRICING_MULTIPLIERS[sector] || 1.0;
  return Math.round(base * multiplier);
};

export const GET_OLD_PRICE = (price: number) => {
  if (price === 0) return 0;
  return Math.round(price * 1.5); // Marketing strategy: show 40% higher price cancelled out
};

export const MEDICAL_FIELDS: CareerField[] = [
  { id: 'med', name: 'General Medicine', description: 'General clinical practice, diagnosis and treatment.' },
  { id: 'nur', name: 'Nursing & Care', description: 'Patient management and nursing excellence.' },
  { id: 'rad', name: 'Radiography', description: 'Medical imaging and radiation science.' },
  { id: 'pha', name: 'Pharmacy', description: 'Pharmaceutical sciences and drug therapy.' },
  { id: 'lab', name: 'Medical Lab', description: 'Laboratory diagnostics and research.' },
];

export const CAREER_FIELDS: CareerField[] = [
  { id: 'tech', name: 'Technology & Engineering', description: 'Software, Data, Product, and Hardware roles.' },
  { id: 'med', name: 'Healthcare & Nursing', description: 'Doctors, Nurses, and Specialists.' },
  { id: 'fin', name: 'Finance & Consulting', description: 'Banking, Audit, Strategy, and Investment.' },
  { id: 'law', name: 'Law & Corporate Legal', description: 'Corporate, Criminal, and Legal Excellence.' },
  { id: 'edu', name: 'Education & Research', description: 'Teaching, Lecturing, and Global Research.' },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'BASIC',
    name: 'Basic Plan',
    price: 4800,
    type: PracticeType.INTERVIEW,
    features: ['Junior Professionals', '10-Minute Mock', 'Instant Feedback'],
    billingCycle: 'once',
    icon: <Zap size={24} />
  },
  {
    id: 'INTERMEDIATE',
    name: 'Intermediate Plan',
    price: 7600,
    type: PracticeType.INTERVIEW,
    features: ['Senior Professionals', '20-Minute Session', 'Detailed Performance Report', 'Session Recording'],
    billingCycle: 'once',
    icon: <ShieldCheck size={24} />
  },
  {
    id: 'ADVANCED',
    name: 'Advanced Plan',
    price: 14200,
    type: PracticeType.INTERVIEW,
    features: ['Senior Experts + Hiring Manager', '30-Minute Intensive', 'Deep Analytical Review', 'Session Recording', 'Reference Letter'],
    billingCycle: 'once',
    icon: <Star size={24} />
  },
];

export const EXAM_PRICING_PLANS: PricingPlan[] = [
  {
    id: 'FREE_EXAM',
    name: 'Free Practice',
    price: 0,
    type: PracticeType.EXAM,
    features: ['5 Sample Questions', 'Instant Score', 'Basic Explanation'],
    billingCycle: 'free',
    icon: <Zap size={24} />
  },
  {
    id: 'PAID_EXAM',
    name: 'Premium Exam',
    price: 3000,
    type: PracticeType.EXAM,
    features: ['30-Min Curated Questions', 'Expert Feedback', 'Detailed Analysis', 'Performance Roadmap'],
    billingCycle: 'once',
    icon: <Star size={24} />
  },
];

export const NAV_LINKS = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Practice', path: '/practice' },
  { name: 'History', path: '/dashboard' },
  { name: 'Profile', path: '/dashboard' },
];

export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: '1',
    text: 'How would you explain a complex technical concept to a non-technical stakeholder?',
    options: ['Use simple analogies', 'Provide technical documentation', 'Explain the code directly', 'Ask them to research it'],
    correctIndex: 0,
    explanation: 'Effective communication requires translating complexity into relatable concepts for your audience.'
  },
  {
    id: '2',
    text: 'What is the most effective way to handle a disagreement within your team?',
    options: ['Ignore it', 'Active listening and finding common ground', 'Inform the manager immediately', 'Push your own agenda'],
    correctIndex: 1,
    explanation: 'Collaboration and empathy are key to professional conflict resolution.'
  }
];

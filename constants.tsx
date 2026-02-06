
import { CareerField, PricingPlan, PracticeType, Question } from './types';

export const CAREER_FIELDS: CareerField[] = [
  { id: 'tech', name: 'Technology & Engineering', description: 'Software, Data, Product, and Hardware roles.' },
  { id: 'med', name: 'Healthcare & Nursing', description: 'Doctors, Nurses, and Medical Specialists.' },
  { id: 'fin', name: 'Finance & Consulting', description: 'Banking, Audit, Strategy, and Investment.' },
  { id: 'law', name: 'Law & Corporate Legal', description: 'Corporate, Criminal, and Legal Excellence.' },
  { id: 'edu', name: 'Education & Research', description: 'Teaching, Lecturing, and Global Research.' },
  { id: 'other', name: 'Other Professional Fields', description: 'Specialized niche career paths.' },
];

// Added MEDICAL_FIELDS to fix the missing export error in PracticeSelector.tsx
export const MEDICAL_FIELDS: CareerField[] = [
  { id: 'med', name: 'General Medicine', description: 'Clinical practice and internal medicine.' },
  { id: 'nur', name: 'Nursing & Care', description: 'Patient care, ethics, and clinical procedures.' },
  { id: 'rad', name: 'Radiography', description: 'Diagnostic imaging and radiation safety.' },
  { id: 'pha', name: 'Pharmacy', description: 'Pharmacology and clinical therapeutics.' },
  { id: 'lab', name: 'Medical Lab Science', description: 'Diagnostic testing and laboratory analysis.' },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'standard_test',
    name: 'Career Test',
    price: 7300,
    type: PracticeType.EXAM,
    features: ['Industry Standard Test', 'AI Insight Report', 'Answer Explanations', 'Strength Mapping'],
    billingCycle: 'once'
  },
  {
    id: 'live_interview',
    name: 'Live Interview',
    price: 11000,
    type: PracticeType.INTERVIEW,
    features: ['45-Min Session', 'Real Industry Experts', 'Body Language Analysis', 'Follow-up Email'],
    billingCycle: 'once'
  },
  {
    id: 'monthly_mastery',
    name: 'Monthly Mastery',
    price: 45000,
    type: PracticeType.SUBSCRIPTION,
    features: ['4 Live Interviews', '1 Session Per Week', '24/7 Priority Support', 'Dedicated Career Coach'],
    billingCycle: 'monthly'
  },
];

export const NAV_LINKS = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Practice', path: '/practice' },
  { name: 'History', path: '/history' },
  { name: 'Profile', path: '/profile' },
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

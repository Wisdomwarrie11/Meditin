
import { CareerField, PricingPlan, PracticeType, Question } from './types';

export const SECTOR_MAPPING: Record<string, string[]> = {
  'Health': ['Medical Doctor', 'Nurse', 'Radiographer', 'Lab Scientist', 'Pharmacist', 'Other / Specify'],
  'Finance': ['Accountant', 'Financial Analyst', 'Investment Banker', 'Auditor', 'Other / Specify'],
  'Sales': ['Sales Representative', 'Account Manager', 'Business Development', 'Sales Director', 'Other / Specify'],
  'Education': ['Primary Teacher', 'Secondary Teacher', 'University Lecturer', 'Researcher', 'Other / Specify'],
};

export const SECTORS = Object.keys(SECTOR_MAPPING);

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
  // --- INTERVIEW PLANS (ONE-OFF ONLY) ---
  {
    id: 'int_basic_once',
    name: 'Basic Plan',
    price: 2500,
    type: PracticeType.INTERVIEW,
    features: ['1 Meditin Representative', '7-Minute Rapid Mock', 'User-Requested Questions (Max 5)', 'Instant Feedback'],
    billingCycle: 'once'
  },
  {
    id: 'int_silver_once',
    name: 'Silver Panel',
    price: 5000,
    type: PracticeType.INTERVIEW,
    features: ['1 Professional + 1 General HR', '15-Minute Session', 'Deep Expert Feedback', 'Session Recording'],
    billingCycle: 'once'
  },
  {
    id: 'int_gold_once',
    name: 'Gold Panel',
    price: 10000,
    type: PracticeType.INTERVIEW,
    features: ['2 Professionals + 1 General HR', '20-Minute Master Session', 'Advanced Analytical Review', 'Professional Reference'],
    billingCycle: 'once'
  },
  {
    id: 'int_diamond_once',
    name: 'Diamond Panel',
    price: 15000,
    type: PracticeType.INTERVIEW,
    features: ['3 Professionals + 1 Specific HR', 'Custom Duration (Extended)', 'Area of Concentration Prep', 'Elite Career Roadmap'],
    billingCycle: 'once'
  },

  // --- EXAM/TEST PLANS ---
  {
    id: 'exam_free',
    name: 'Exam/Test Free Tier',
    price: 0,
    type: PracticeType.EXAM,
    features: ['3 Time Trials in 6 months', 'Standard Feedback', 'Basic Result Analytics'],
    billingCycle: 'free'
  },
  {
    id: 'exam_one_off',
    name: 'Exam/Test One-Off',
    price: 3000,
    type: PracticeType.EXAM,
    features: ['1 Practice Session', 'Max 3 Courses/Subjects', 'Detailed Answer Explanations', 'Performance Scoring'],
    billingCycle: 'once'
  },
  {
    id: 'exam_monthly',
    name: 'Exam/Test Monthly Master',
    price: 10700,
    type: PracticeType.EXAM,
    features: ['4 Sessions per week', 'Max 3 Courses per session', 'Unlimited Explanation Access', 'Progress Tracking'],
    billingCycle: 'monthly'
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

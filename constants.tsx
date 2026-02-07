
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
  { id: 'med', name: 'Healthcare & Nursing', description: 'Doctors, Nurses, and Medical Specialists.' },
  { id: 'fin', name: 'Finance & Consulting', description: 'Banking, Audit, Strategy, and Investment.' },
  { id: 'law', name: 'Law & Corporate Legal', description: 'Corporate, Criminal, and Legal Excellence.' },
  { id: 'edu', name: 'Education & Research', description: 'Teaching, Lecturing, and Global Research.' },
];

export const PRICING_PLANS: PricingPlan[] = [
  // Interview Plans
  {
    id: 'int_one_off',
    name: 'Interview One-Off',
    price: 4000,
    type: PracticeType.INTERVIEW,
    features: ['30-Min Session', 'Panel of Professionals', 'Strengths & Weaknesses Feedback', 'Career Guidance'],
    billingCycle: 'once'
  },
  {
    id: 'int_monthly',
    name: 'Interview Monthly Master',
    price: 14500,
    type: PracticeType.INTERVIEW,
    features: ['4 Sessions (1 per week)', '30-Min per Session', 'Deep Feedback Analytics', 'Priority Scheduling'],
    billingCycle: 'monthly'
  },
  // Exam/Test Plans
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

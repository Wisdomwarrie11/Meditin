
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SAMPLE_QUESTIONS } from '../constants';
import { generateMedicalFeedback } from '../services/geminiService';
import { 
  Timer, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft,
  Loader2
} from 'lucide-react';

const ExamEngine: React.FC = () => {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(SAMPLE_QUESTIONS.length).fill(-1));
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleFinish = async () => {
    setIsFinished(true);
    setIsGeneratingFeedback(true);

    const score = answers.reduce((acc, ans, idx) => {
      return ans === SAMPLE_QUESTIONS[idx].correctIndex ? acc + 1 : acc;
    }, 0);

    const performanceSummary = `
      Student got ${score} out of ${SAMPLE_QUESTIONS.length} correct.
      Questions covered: Clinical diagnosis and Drug side effects.
    `;

    const aiFeedback = await generateMedicalFeedback('EXAM', 'General Medicine', performanceSummary);
    setFeedback(aiFeedback);
    setIsGeneratingFeedback(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (isFinished) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-700">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Exam Completed!</h2>
          <p className="text-slate-500 mt-2">Your results have been processed by our medical review engine.</p>
          
          <div className="mt-8 flex justify-center gap-12 border-y border-slate-100 py-8">
            <div className="text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Score</p>
              <p className="text-4xl font-black text-slate-900">
                {Math.round((answers.reduce((a, b, i) => b === SAMPLE_QUESTIONS[i].correctIndex ? a + 1 : a, 0) / SAMPLE_QUESTIONS.length) * 100)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Time Used</p>
              <p className="text-4xl font-black text-slate-900">{formatTime(600 - timeLeft)}</p>
            </div>
          </div>
        </div>

        {isGeneratingFeedback ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
            <h4 className="text-lg font-bold text-slate-900">Generating AI Performance Insights...</h4>
            <p className="text-slate-500">Our medical LLM is reviewing your clinical reasoning.</p>
          </div>
        ) : feedback && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8 animate-in slide-in-from-bottom duration-500">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <AlertCircle className="text-blue-600" size={24} />
                Detailed Feedback
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                  <p className="font-bold text-green-800 mb-3 flex items-center gap-2">
                    <CheckCircle2 size={18} /> Strengths
                  </p>
                  <ul className="space-y-2">
                    {feedback.strengths.map((s: string, i: number) => (
                      <li key={i} className="text-sm text-green-700 flex gap-2"><span>•</span> {s}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                  <p className="font-bold text-red-800 mb-3 flex items-center gap-2">
                    <XCircle size={18} /> Improvement Areas
                  </p>
                  <ul className="space-y-2">
                    {feedback.weaknesses.map((w: string, i: number) => (
                      <li key={i} className="text-sm text-red-700 flex gap-2"><span>•</span> {w}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-2">Clinical Recommendations</h4>
              <p className="text-slate-600 text-sm leading-relaxed">{feedback.recommendations}</p>
            </div>

            <button 
              onClick={() => navigate('/')}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </div>
    );
  }

  const currentQ = SAMPLE_QUESTIONS[currentIdx];

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm sticky top-20 z-20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
            {currentIdx + 1}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progress</p>
            <p className="text-sm font-bold text-slate-900">{currentIdx + 1} of {SAMPLE_QUESTIONS.length} Questions</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-red-50 px-4 py-2 rounded-xl text-red-600">
          <Timer size={20} />
          <span className="font-mono text-xl font-bold">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-10">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 leading-snug">
            {currentQ.text}
          </h2>
        </div>

        <div className="space-y-3">
          {currentQ.options.map((option, i) => (
            <button
              key={i}
              onClick={() => {
                const newAnswers = [...answers];
                newAnswers[currentIdx] = i;
                setAnswers(newAnswers);
              }}
              className={`
                w-full p-6 text-left rounded-2xl border-2 transition-all flex items-center justify-between group
                ${answers[currentIdx] === i 
                  ? 'border-blue-600 bg-blue-50' 
                  : 'border-slate-100 bg-white hover:border-blue-200'}
              `}
            >
              <div className="flex items-center gap-4">
                <span className={`
                  w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
                  ${answers[currentIdx] === i ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}
                `}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className={`font-semibold ${answers[currentIdx] === i ? 'text-blue-900' : 'text-slate-700'}`}>
                  {option}
                </span>
              </div>
              {answers[currentIdx] === i && (
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={16} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-8 border-t border-slate-100">
          <button
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(prev => prev - 1)}
            className="px-6 py-3 text-slate-500 font-semibold disabled:opacity-30 flex items-center gap-2 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={20} /> Previous
          </button>
          
          {currentIdx === SAMPLE_QUESTIONS.length - 1 ? (
            <button
              onClick={handleFinish}
              className="px-10 py-4 bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-100 hover:bg-green-700 transition-all"
            >
              Submit Exam
            </button>
          ) : (
            <button
              onClick={() => setCurrentIdx(prev => prev + 1)}
              className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all"
            >
              Next Question <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamEngine;

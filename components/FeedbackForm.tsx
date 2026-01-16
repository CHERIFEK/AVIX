
import React, { useState } from 'react';

interface FeedbackFormProps {
  onSubmit: (mood: number, comment: string) => void;
}

const MOODS = [
  { val: 1, icon: '😫', label: 'Awful' },
  { val: 2, icon: '🙁', label: 'Poor' },
  { val: 3, icon: '😐', label: 'Neutral' },
  { val: 4, icon: '🙂', label: 'Good' },
  { val: 5, icon: '🤩', label: 'Amazing' },
];

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit }) => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMood === null) return;
    
    onSubmit(selectedMood, comment);
    setSubmitted(true);
    
    // Reset after success
    setTimeout(() => {
      setSubmitted(false);
      setSelectedMood(null);
      setComment('');
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-green-50 rounded-3xl animate-in fade-in zoom-in duration-300">
        <div className="text-6xl mb-4">✨</div>
        <h2 className="text-2xl font-bold text-green-800">Feedback Shared!</h2>
        <p className="text-green-600 mt-2 text-center">Your voice matters. Thank you for contributing anonymously to our culture.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-lg mx-auto bg-white p-8 rounded-3xl soft-shadow">
      <div className="space-y-4">
        <label className="block text-lg font-semibold text-slate-700 text-center">
          How are you feeling today?
        </label>
        <div className="flex justify-between gap-2">
          {MOODS.map((m) => (
            <button
              key={m.val}
              type="button"
              onClick={() => setSelectedMood(m.val)}
              className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-300 border-2 ${
                selectedMood === m.val 
                  ? 'bg-blue-50 border-blue-400 scale-110' 
                  : 'bg-slate-50 border-transparent hover:border-slate-200'
              }`}
            >
              <span className="text-3xl mb-1">{m.icon}</span>
              <span className={`text-xs ${selectedMood === m.val ? 'font-bold text-blue-600' : 'text-slate-500'}`}>
                {m.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-lg font-semibold text-slate-700 text-center">
          Any specific feedback or comments?
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="I'm feeling... because..."
          className="w-full h-32 p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all outline-none text-slate-700 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={selectedMood === null}
        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${
          selectedMood !== null 
            ? 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95' 
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        Submit Feedback
      </button>
      <p className="text-center text-xs text-slate-400 uppercase tracking-widest font-medium">100% Anonymous</p>
    </form>
  );
};

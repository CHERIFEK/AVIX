
import React, { useState } from 'react';
import { Feedback, ActionPlan } from '../types';
import { MoodChart } from './MoodChart';
import { generateActionPlan } from '../services/geminiService';

interface DashboardProps {
  feedbacks: Feedback[];
}

export const Dashboard: React.FC<DashboardProps> = ({ feedbacks }) => {
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const avgMood = feedbacks.length > 0 
    ? (feedbacks.reduce((acc, f) => acc + f.mood, 0) / feedbacks.length).toFixed(1)
    : '0.0';

  const handleMagicButton = async () => {
    if (feedbacks.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const plan = await generateActionPlan(feedbacks);
      setActionPlan(plan);
    } catch (err) {
      setError('AI summary failed. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Statistics Card */}
        <div className="bg-white p-6 rounded-3xl soft-shadow border border-slate-100">
          <h3 className="text-slate-500 font-semibold mb-4 uppercase text-sm tracking-wider">Overall Sentiment</h3>
          <div className="flex items-end gap-4">
            <span className="text-5xl font-bold text-slate-800">{avgMood}</span>
            <span className="text-slate-400 mb-1">out of 5.0 avg</span>
          </div>
          <p className="text-slate-500 mt-2 text-sm">Based on {feedbacks.length} anonymous responses</p>
        </div>

        {/* Chart Card */}
        <div className="bg-white p-6 rounded-3xl soft-shadow border border-slate-100">
          <h3 className="text-slate-500 font-semibold mb-4 uppercase text-sm tracking-wider">Mood Distribution</h3>
          <MoodChart feedbacks={feedbacks} />
        </div>
      </div>

      {/* AI Magic Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-3xl border border-indigo-100 soft-shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <span className="text-3xl">✨</span> AI Insights
            </h2>
            <p className="text-slate-600">Turn raw feedback into a 3-point strategy.</p>
          </div>
          <button
            onClick={handleMagicButton}
            disabled={loading || feedbacks.length === 0}
            className={`px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl ${
              loading || feedbacks.length === 0
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-95'
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                Processing...
              </>
            ) : (
              'Generate 3-Point Plan'
            )}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-xl mb-6">
            {error}
          </div>
        )}

        {actionPlan ? (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <div className="p-4 bg-indigo-100/50 rounded-2xl border border-indigo-200">
              <p className="text-indigo-900 leading-relaxed italic">"{actionPlan.summary}"</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[actionPlan.point1, actionPlan.point2, actionPlan.point3].map((point, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl font-black text-indigo-600">
                    {i + 1}
                  </div>
                  <h4 className="font-bold text-indigo-900 mb-2 relative z-10">Step {i + 1}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed relative z-10">{point}</p>
                </div>
              ))}
            </div>
          </div>
        ) : !loading && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
             <div className="text-6xl mb-4">🪄</div>
             <p>Click the button to reveal your AI-powered management roadmap.</p>
          </div>
        )}
      </div>

      {/* Recent Comments Feed */}
      <div className="bg-white p-6 rounded-3xl soft-shadow border border-slate-100">
        <h3 className="text-slate-500 font-semibold mb-6 uppercase text-sm tracking-wider">Raw Feedback (Anonymous)</h3>
        <div className="space-y-4">
          {feedbacks.length === 0 ? (
            <p className="text-slate-400 italic">No feedback received yet.</p>
          ) : (
            [...feedbacks].reverse().slice(0, 5).map(f => (
              <div key={f.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xl shadow-inner ${
                   f.mood >= 4 ? 'bg-green-100' : f.mood === 3 ? 'bg-yellow-100' : 'bg-red-100'
                 }`}>
                   {f.mood === 1 ? '😫' : f.mood === 2 ? '🙁' : f.mood === 3 ? '😐' : f.mood === 4 ? '🙂' : '🤩'}
                 </div>
                 <div>
                   <p className="text-slate-700 text-sm leading-relaxed">{f.comment || <span className="text-slate-400 italic">No comment provided</span>}</p>
                   <span className="text-[10px] text-slate-400 uppercase tracking-tighter mt-2 block">
                     {new Date(f.timestamp).toLocaleTimeString()} • Anonymous
                   </span>
                 </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

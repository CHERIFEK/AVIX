
import React, { useState, useEffect } from 'react';
import { ViewMode, Feedback } from './types';
import { FeedbackForm } from './components/FeedbackForm';
import { Dashboard } from './components/Dashboard';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.EMPLOYEE);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('culture_pulse_data');
    if (saved) {
      try {
        setFeedbacks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load feedback", e);
      }
    } else {
      // Mock data for initial delight if empty
      const mockData: Feedback[] = [
        { id: '1', mood: 4, comment: 'I really love the new flexible hours!', timestamp: Date.now() - 10000000 },
        { id: '2', mood: 2, comment: 'Meetings are taking over my deep work time.', timestamp: Date.now() - 8000000 },
        { id: '3', mood: 5, comment: 'Great team collaboration today on the project.', timestamp: Date.now() - 5000000 },
        { id: '4', mood: 3, comment: 'Office snacks are a bit low lately.', timestamp: Date.now() - 3000000 },
        { id: '5', mood: 1, comment: 'Feeling quite burnt out with the current deadline.', timestamp: Date.now() - 1000000 },
      ];
      setFeedbacks(mockData);
    }
  }, []);

  // Save to localStorage whenever feedback updates
  useEffect(() => {
    localStorage.setItem('culture_pulse_data', JSON.stringify(feedbacks));
  }, [feedbacks]);

  const handleFeedbackSubmit = (mood: number, comment: string) => {
    const newFeedback: Feedback = {
      id: Math.random().toString(36).substr(2, 9),
      mood,
      comment,
      timestamp: Date.now()
    };
    setFeedbacks(prev => [...prev, newFeedback]);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-white text-xl">💙</span>
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              CulturePulse
            </h1>
          </div>
          
          <nav className="flex p-1 bg-slate-100 rounded-2xl">
            <button
              onClick={() => setViewMode(ViewMode.EMPLOYEE)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                viewMode === ViewMode.EMPLOYEE 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Feedback
            </button>
            <button
              onClick={() => setViewMode(ViewMode.MANAGEMENT)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                viewMode === ViewMode.MANAGEMENT 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Dashboard
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 pt-12">
        {viewMode === ViewMode.EMPLOYEE ? (
          <div className="space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-4xl font-extrabold text-slate-800">Your voice is anonymous.</h2>
              <p className="text-slate-500 text-lg">Help us shape a better workplace, one feeling at a time.</p>
            </div>
            <FeedbackForm onSubmit={handleFeedbackSubmit} />
          </div>
        ) : (
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-800">Culture Dashboard</h2>
                <p className="text-slate-500">Real-time health of your organization.</p>
              </div>
              <button 
                onClick={() => {
                  if (confirm('Clear all feedback data? This cannot be undone.')) {
                    setFeedbacks([]);
                  }
                }}
                className="text-red-400 text-sm hover:text-red-600 transition-colors uppercase tracking-widest font-bold"
              >
                Reset Data
              </button>
            </div>
            <Dashboard feedbacks={feedbacks} />
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="mt-20 text-center py-10 opacity-40">
        <p className="text-slate-500 text-sm">Powered by Gemini AI • 100% Secure & Privacy Focused</p>
      </footer>
    </div>
  );
};

export default App;

import React, { useState } from 'react';
import HabitTracker from './components/HabitTracker';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function App() {
  const [date, setDate] = useState(new Date());
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const handlePrevMonth = () => {
    setDate(new Date(year, month - 2, 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(year, month, 1));
  };

  const monthName = date.toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric' }).toUpperCase();

  return (
    <div className="min-h-screen bg-elegant-bg text-elegant-text font-sans selection:bg-navy selection:text-gold pb-12">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-navy text-white shadow-md z-50 flex items-center justify-between px-4 md:px-8 border-b-2 border-gold">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Bata Planner Logo" className="w-9 h-9 rounded shadow-sm border border-gold/30 object-cover" />
          <h1 className="font-serif font-bold text-xl tracking-wider text-gold">BATA PLANNER</h1>
        </div>

        <div className="flex items-center gap-4 text-elegant-bg">
          <button onClick={handlePrevMonth} className="p-2 hover:text-gold transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-serif font-bold w-40 text-center select-none tracking-widest text-gold-light">
            {monthName}
          </span>
          <button onClick={handleNextMonth} className="p-2 hover:text-gold transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="w-8"></div> {/* Spacer for balance */}
      </nav>

      {/* Main Content Area */}
      <main className="pt-24 px-4 max-w-7xl mx-auto h-[calc(100vh-80px)] flex flex-col items-center">
        <div className="bg-elegant-card shadow-2xl rounded-lg border border-gray-100 p-6 w-full max-w-6xl relative">
          {/* Decorative Top Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-navy via-gold to-navy"></div>
          
          <div className="mb-6 border-b border-gray-200 pb-4 text-center"></div>
          <HabitTracker year={year} month={month} />
        </div>
      </main>
    </div>
  );
}

export default App;

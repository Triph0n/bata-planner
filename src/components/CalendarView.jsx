import React from 'react';
import { usePlannerStore } from '../hooks/usePlannerStore';

const CalendarView = ({ year, month }) => {
    const { getMonthData, updateStore } = usePlannerStore(); // Using generic update for deeper nested updates if needed
    const data = getMonthData(year, month);
    const daysInMonth = new Date(year, month, 0).getDate();

    // Helper to get day name
    const getDayName = (day) => {
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('cs-CZ', { weekday: 'long' }).toUpperCase();
    };

    const handlePriorityToggle = (day) => {
        // Deep update structure is tricky with just get/set, let's use the updateMonthData via store
        // But store helper updateMonthData merges at top level. We need deeper merge or smart update.
        // Let's manually construct the new planner object for the month
        const currentPlanner = { ...data.planner };
        const dayData = currentPlanner[day] || { priority: false, tasks: '' };

        currentPlanner[day] = { ...dayData, priority: !dayData.priority };

        // We need to call updateMonthData from store, but I need to import it properly or use the one from hook
        // The hook returns updateMonthData.
        // BUT, I need access to it. I'll pass it in or re-grab it.
        // Actually I have it in scope if I destructured it.
        // Re-reading hook usage: const { ... } = usePlannerStore();
        // Ah, in previous file I used updateMonthData. Here I need to make sure I use it.
    };

    // We need updateMonthData from the store hook, I missed destructuring it in the component body above.
    // Let me fix the component code to include it.

    return (
        <CalendarViewImpl year={year} month={month} />
    );
};

const CalendarViewImpl = ({ year, month }) => {
    const { getMonthData, updateMonthData } = usePlannerStore();
    const data = getMonthData(year, month);
    const daysInMonth = new Date(year, month, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const handlePriority = (day) => {
        const planner = { ...data.planner };
        const dayData = planner[day] || { priority: false, text: '' };
        planner[day] = { ...dayData, priority: !dayData.priority };
        updateMonthData(year, month, { planner });
    };

    const handleTextChange = (day, text) => {
        const planner = { ...data.planner };
        const dayData = planner[day] || { priority: false, text: '' };
        planner[day] = { ...dayData, text };
        updateMonthData(year, month, { planner });
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-white min-h-screen text-black">
            <div className="grid grid-cols-1 divide-y divide-gray-200">
                {days.map(d => {
                    const dayData = data.planner[d] || { priority: false, text: '' };
                    const dayName = new Date(year, month - 1, d).toLocaleDateString('cs-CZ', { weekday: 'long' }).toUpperCase();

                    return (
                        <div key={d} className="flex flex-row h-32 group">
                            {/* Priority Column */}
                            <div className="w-16 border-r border-dotted border-gray-300 flex items-center justify-center pt-4 flex-col">
                                <span className="text-[9px] text-gray-400 mb-1 tracking-widest uppercase rotate-180" style={{ writingMode: 'vertical-rl' }}>priority</span>
                                <div
                                    className={`w-6 h-6 border border-black cursor-pointer bg-white transition-colors ${dayData.priority ? 'bg-black' : ''}`}
                                    onClick={() => handlePriority(d)}
                                />
                            </div>

                            {/* Date Column */}
                            <div className="w-32 border-r border-dotted border-gray-300 p-4 flex flex-col justify-start">
                                <span className="text-3xl font-serif">{d}</span>
                                <span className="text-sm font-bold tracking-wider">{dayName}</span>
                            </div>

                            {/* Tasks / Notes Column */}
                            <div className="flex-1 relative">
                                <textarea
                                    className="w-full h-full bg-transparent resize-none focus:outline-none text-lg font-handwriting px-4 py-0"
                                    value={dayData.text}
                                    onChange={(e) => handleTextChange(d, e.target.value)}
                                    style={{
                                        lineHeight: '2.5rem',
                                        backgroundImage: 'repeating-linear-gradient(transparent 0, transparent calc(2.5rem - 1px), #e5e7eb calc(2.5rem - 1px), #e5e7eb 2.5rem)',
                                        backgroundAttachment: 'local',
                                        backgroundPosition: '0 2.4rem' // Offset to make text sit on line
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarView;

import React from 'react';
import { usePlannerStore } from '../hooks/usePlannerStore';
import { cn } from '../lib/utils';
import { Smile, Briefcase, Moon, Coffee, Apple, Calculator, Meh, Frown } from 'lucide-react';

const HabitTracker = ({ year, month }) => {
    const { getMonthData, toggleHabit, updateMonthData, getHabitName, updateHabitName, getHabitCounts, addHabit } = usePlannerStore();
    const data = getMonthData(year, month);
    const daysInMonth = new Date(year, month, 0).getDate();
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    const handleCheck = (type, index, dayIdx) => {
        toggleHabit(year, month, type, index, dayIdx);
    };

    const handleLifestyleChange = (type, dayIdx, value) => {
        const currentType = data.habits.lifestyle[type] || [];
        const newArr = [...currentType];
        newArr[dayIdx] = value;

        updateMonthData(year, month, {
            habits: {
                ...data.habits,
                lifestyle: {
                    ...data.habits.lifestyle,
                    [type]: newArr
                }
            }
        });
    };

    const cycleMood = (type, dayIdx, currentVal) => {
        const states = ['', 'smile', 'meh', 'frown'];
        const currentIndex = states.indexOf(currentVal) === -1 ? 0 : states.indexOf(currentVal);
        const nextIndex = (currentIndex + 1) % states.length;
        handleLifestyleChange(type, dayIdx, states[nextIndex]);
    };

    // Helper to render merged Food/Mood row
    const renderFoodMoodRow = () => (
        <div className="grid grid-cols-[150px_repeat(31,1fr)] gap-0 border-b border-navy/20 h-14">
            <div className="border-r border-navy/20 flex flex-col h-full text-[10px] font-serif">
                <div className="flex-1 flex items-center justify-center border-b border-navy/5 p-1">
                    <span className="font-bold">výživa</span>
                </div>
                <div className="flex-1 flex items-center justify-center p-1">
                    <span className="font-bold">nálada</span>
                </div>
            </div>
            {days.map((d, i) => {
                const foodVal = data.habits.lifestyle.food ? data.habits.lifestyle.food[i] : '';
                const moodVal = data.habits.lifestyle.mood ? data.habits.lifestyle.mood[i] : '';

                if (i >= daysInMonth) {
                    return <div key={i} className="border-r border-navy/10 bg-elegant-bg h-full"></div>;
                }

                return (
                    <div key={i} className="border-r border-navy/10 flex flex-col h-full">
                        {/* Food Half */}
                        <div className="flex-1 flex items-center justify-center border-b border-dotted border-navy/10">
                            <input
                                type="checkbox"
                                className="w-3 h-3 rounded-none border-navy/40 text-navy accent-gold focus:ring-0 cursor-pointer"
                                checked={foodVal === true || foodVal === 'true' || foodVal === true}
                                onChange={(e) => handleLifestyleChange('food', i, e.target.checked)}
                            />
                        </div>
                        {/* Mood Half */}
                        <div
                            className="flex-1 flex items-center justify-center cursor-pointer hover:bg-navy/5 bg-white"
                            onClick={() => cycleMood('mood', i, moodVal)}
                        >
                            {moodVal === 'smile' && <Smile size={14} className="text-green-600 fill-green-100" />}
                            {moodVal === 'meh' && <Meh size={14} className="text-orange-400 fill-orange-50" />}
                            {moodVal === 'frown' && <Frown size={14} className="text-red-600 fill-red-100" />}
                            {!moodVal && <div className="w-2 h-2 rounded-full border border-navy/20" />}
                        </div>
                    </div>
                );
            })}
        </div>
    );

    // Reuse customized smaller row height for others
    const ROW_H = "h-7"; // Reduced from h-8

    // Helper for Daily Habits (31 days)
    const renderDailyRow = (index) => (
        <div className={`grid grid-cols-[150px_repeat(31,1fr)] gap-0 border-b border-navy/20 ${ROW_H}`}>
            <div className="p-0 border-r border-navy/20 text-[10px] font-serif font-bold flex items-center">
                <input
                    type="text"
                    className="w-full h-full px-2 bg-transparent focus:bg-navy/5 focus:outline-none placeholder-navy/30 font-bold"
                    value={getHabitName('daily', index)}
                    onChange={(e) => updateHabitName('daily', index, e.target.value)}
                    placeholder="Název návyku"
                />
            </div>
            {days.map((d, i) => {
                const isChecked = data.habits.daily[index] ? data.habits.daily[index][i] : false;
                return (
                    <div key={i} className={`border-r border-navy/10 flex items-center justify-center ${ROW_H}`}>
                        {i < daysInMonth ? (
                            <input
                                type="checkbox"
                                className="w-3 h-3 rounded-none border-navy/40 text-navy accent-gold focus:ring-0 cursor-pointer"
                                checked={isChecked}
                                onChange={() => handleCheck('daily', index, i)}
                            />
                        ) : <div className="bg-elegant-bg w-full h-full" />}
                    </div>
                );
            })}
        </div>
    );

    // Simplified Weekly
    const renderWeeklyRowMerged = (index) => (
        <div className={`flex w-full border-b border-navy/20 ${ROW_H}`}>
            <div className="w-[150px] flex-shrink-0 p-0 border-r border-navy/20 text-[10px] font-serif font-bold flex items-center">
                <input
                    type="text"
                    className="w-full h-full px-2 bg-transparent focus:bg-navy/5 focus:outline-none placeholder-navy/30 font-bold"
                    value={getHabitName('weekly', index)}
                    onChange={(e) => updateHabitName('weekly', index, e.target.value)}
                    placeholder="Název návyku"
                />
            </div>
            <div className="flex-1 flex">
                {[0, 1, 2, 3].map(i => (
                    <div key={i} className="flex-1 border-r border-navy/10 flex items-center justify-center bg-navy/5/30">
                        <label className="flex items-center gap-2 cursor-pointer select-none hover:bg-black/5 px-2 py-0.5 rounded">
                            <span className="text-[9px] text-navy/50 font-serif uppercase tracking-wider">Týden {i + 1}</span>
                            <input
                                type="checkbox"
                                className="w-3 h-3 rounded-none border-navy/40 text-navy accent-gold focus:ring-0"
                                checked={data.habits.weekly[index] ? data.habits.weekly[index][i] : false}
                                onChange={() => handleCheck('weekly', index, i)}
                            />
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );

    // Helper for Monthly Habit (1 check)
    const renderMonthlyRow = (index) => (
        <div className={`flex w-full border-b border-navy/20 ${ROW_H}`}>
            <div className="w-[150px] flex-shrink-0 p-0 border-r border-navy/20 text-[10px] font-serif font-bold flex items-center">
                <input
                    type="text"
                    className="w-full h-full px-2 bg-transparent focus:bg-navy/5 focus:outline-none placeholder-navy/30 font-bold"
                    value={getHabitName('monthly', index)}
                    onChange={(e) => updateHabitName('monthly', index, e.target.value)}
                    placeholder="Název návyku"
                />
            </div>
            <div className="flex-1 flex items-center justify-center bg-navy/5/30">
                <label className="flex items-center gap-2 cursor-pointer select-none hover:bg-black/5 px-4 py-0.5 rounded">
                    <span className="text-[9px] text-navy/50 font-serif uppercase tracking-wider">Splněno</span>
                    <input
                        type="checkbox"
                        className="w-4 h-4 rounded-none border-navy/40 text-navy accent-gold focus:ring-0"
                        checked={data.habits.monthly[index] ? data.habits.monthly[index][0] : false}
                        onChange={() => handleCheck('monthly', index, 0)}
                    />
                </label>
            </div>
        </div>
    );


    // Helper for lifestyle row
    const renderLifestyleRow = (title, type, icon, inputType = 'checkbox') => (
        <div className={`grid grid-cols-[150px_repeat(31,1fr)] gap-0 border-b border-navy/20 ${ROW_H}`}>
            <div className="p-2 border-r border-navy/20 text-[10px] font-serif flex flex-col justify-center">
                <span className="font-bold">{title}</span>
            </div>
            {days.map((d, i) => {
                const val = data.habits.lifestyle[type] ? data.habits.lifestyle[type][i] : '';

                let cellContent = null;

                if (i < daysInMonth) {
                    // Checkbox for others
                    cellContent = (
                        <div className="w-full h-full flex items-center justify-center">
                            <input
                                type="checkbox"
                                className="w-3 h-3 rounded-none border-navy/40 text-navy accent-gold focus:ring-0 cursor-pointer"
                                checked={val === true || val === 'true' || val === true}
                                onChange={(e) => handleLifestyleChange(type, i, e.target.checked)}
                            />
                        </div>
                    );
                } else {
                    cellContent = <div className="bg-elegant-bg w-full h-full" />;
                }

                return (
                    <div key={i} className={`border-r border-navy/10 flex items-center justify-center ${ROW_H}`}>
                        {cellContent}
                    </div>
                );
            })}
        </div>
    );

    const counts = getHabitCounts();

    return (
        <div className="w-full overflow-x-auto bg-transparent text-navy text-xs">
            <div className="min-w-[900px] border border-navy/30 rounded-lg overflow-hidden shadow-sm">
                {/* Header Row */}
                <div className="grid grid-cols-[150px_repeat(31,1fr)] border-b border-navy/30 bg-navy text-gold">
                    <div className="p-1 px-2 border-r border-navy/30 font-serif font-bold text-xs uppercase flex items-center tracking-widest">
                        {new Date(year, month - 1).toLocaleDateString('cs-CZ', { month: 'long' })}
                    </div>
                    {days.map(d => (
                        <div key={d} className="border-r border-navy/30 text-center text-[9px] py-1 font-bold text-white flex items-center justify-center">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Section: Habits */}
                <div className="border-b-2 border-gold/40 bg-white">
                    {/* Render Daily Habits */}
                    {Array.from({ length: counts.daily }, (_, i) => i + 1).map(index => renderDailyRow(index))}
                    <div className="border-b border-navy/20 bg-navy/5">
                        <button onClick={() => addHabit('daily')} className="w-full py-1 text-xs text-navy/70 hover:text-navy font-bold flex items-center justify-center gap-1">
                            + Přidat denní návyk
                        </button>
                    </div>

                    {/* Render Weekly Habits */}
                    {Array.from({ length: counts.weekly }, (_, i) => i + 1).map(index => renderWeeklyRowMerged(index))}
                    <div className="border-b border-navy/20 bg-navy/5">
                        <button onClick={() => addHabit('weekly')} className="w-full py-1 text-xs text-navy/70 hover:text-navy font-bold flex items-center justify-center gap-1">
                            + Přidat týdenní návyk
                        </button>
                    </div>

                    {/* Render Monthly Habits */}
                    {Array.from({ length: counts.monthly }, (_, i) => i + 1).map(index => renderMonthlyRow(index))}
                    <div className="border-b border-navy/20 bg-navy/5">
                        <button onClick={() => addHabit('monthly')} className="w-full py-1 text-xs text-navy/70 hover:text-navy font-bold flex items-center justify-center gap-1">
                            + Přidat měsíční návyk
                        </button>
                    </div>
                </div>

                {/* Section header */}
                <div className="p-1 px-2 font-serif font-bold text-sm border-b border-navy/30 bg-navy/5 text-navy flex justify-between items-center">
                    <span className="tracking-wide">Nejprve vybuduj sám sebe.</span>
                </div>

                {/* Section: Lifestyle */}
                <div className="bg-white">
                    {renderLifestyleRow("spánek", "sleep", null, 'checkbox')}
                    {renderLifestyleRow("práce", "work", null, 'checkbox')}
                    {renderLifestyleRow("odpočinek", "rest", null, 'checkbox')}
                    {/* Merged Food/Mood Row */}
                    {renderFoodMoodRow()}
                </div>
            </div>
        </div>
    );
};

export default HabitTracker;

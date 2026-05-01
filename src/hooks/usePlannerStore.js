import { useState, useEffect } from 'react';

const STORAGE_KEY = 'bata-planner-data-v2';

export const usePlannerStore = () => {
    const [data, setData] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.error("Failed to load data", e);
            return {};
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error("Failed to save data", e);
        }
    }, [data]);

    const getMonthData = (year, month) => {
        const key = `${year}-${month}`;
        return data[key] || {
            habits: {
                daily: {
                    1: new Array(31).fill(false),
                    2: new Array(31).fill(false),
                    3: new Array(31).fill(false),
                    4: new Array(31).fill(false),
                    5: new Array(31).fill(false)
                },
                weekly: {
                    1: new Array(4).fill(false),
                    2: new Array(4).fill(false),
                    3: new Array(4).fill(false)
                },
                monthly: { 1: [false] },
                lifestyle: {
                    sleep: new Array(31).fill(''),
                    work: new Array(31).fill(''),
                    rest: new Array(31).fill(''),
                    mood: new Array(31).fill(''),
                    food: new Array(31).fill(''),
                }
            },
            planner: {} // day -> { priority: string, tasks: string[] }
        };
    };

    const updateMonthData = (year, month, partialData) => {
        const key = `${year}-${month}`;
        const currentMonth = getMonthData(year, month);

        // Deep merge logic simplified
        const newData = { ...currentMonth, ...partialData };
        if (partialData.habits) {
            newData.habits = { ...currentMonth.habits, ...partialData.habits };
            // Handle sub-objects if needed, but for now simple spread might be risky if not careful. 
            // Let's rely on the caller to provide full sub-structures or improve this.
        }

        setData(prev => ({
            ...prev,
            [key]: newData
        }));
    };

    // Helper to toggle a habit check
    const toggleHabit = (year, month, type, index, dayIndex) => {
        const key = `${year}-${month}`;
        const currentMonth = getMonthData(year, month);
        const habits = { ...currentMonth.habits };

        if (type === 'daily') {
            // For daily, each row is an array of 31
            const row = [...(habits.daily[index] || new Array(31).fill(false))];
            row[dayIndex] = !row[dayIndex];
            habits.daily = { ...habits.daily, [index]: row };
        } else if (type === 'weekly') {
            // For weekly, each row is an array of 4 (for 4 weeks)
            const row = [...(habits.weekly[index] || new Array(4).fill(false))];
            row[dayIndex] = !row[dayIndex]; // dayIndex here will be 0-3
            habits.weekly = { ...habits.weekly, [index]: row };
        } else if (type === 'monthly') {
            // For monthly, it's a single array of booleans (one per habit row) or just a value?
            // The UI asks for "I. měsíční návyk", so likely row 1.
            // We can treat it as an array where index 0 is value for month.
            const row = [...(habits.monthly[index] || [false])];
            row[0] = !row[0];
            habits.monthly = { ...habits.monthly, [index]: row };
        }

        setData(prev => ({ ...prev, [key]: { ...currentMonth, habits } }));
    };

    // Global Habit Names (stored at root, not per month)
    // Structure: { daily: { 1: "Name" }, weekly: { 1: "Name" }, monthly: { 1: "Name" } }

    const getHabitName = (type, index) => {
        return data.habitNames?.[type]?.[index] || getDefaultHabitName(type, index);
    };

    const updateHabitName = (type, index, newName) => {
        const currentNames = data.habitNames || { daily: {}, weekly: {}, monthly: {} };
        const typeNames = currentNames[type] || {};

        const newData = {
            ...data,
            habitNames: {
                ...currentNames,
                [type]: {
                    ...typeNames,
                    [index]: newName
                }
            }
        };
        setData(newData);
    };

    const getDefaultHabitName = (type, index) => {
        const rom = ["I", "II", "III", "IV", "V"];
        const roman = rom[index - 1] || index;
        if (type === 'daily') return `${roman}. denní návyk`;
        if (type === 'weekly') return `${roman}. týdenní návyk`;
        if (type === 'monthly') return `${roman}. měsíční návyk`;
        return `${type} ${index}`;
    };

    return {
        data,
        getMonthData,
        updateMonthData,
        toggleHabit,
        getHabitName,
        updateHabitName
    };
};

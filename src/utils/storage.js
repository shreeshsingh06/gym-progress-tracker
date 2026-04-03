import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'aura_react_workouts';

export const getWorkouts = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

export const saveWorkout = (workoutData) => {
    const workouts = getWorkouts();
    const newWorkout = {
        id: uuidv4(),
        ...workoutData,
        date: workoutData.date || new Date().toISOString()
    };
    workouts.push(newWorkout);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
    return newWorkout;
};

export const deleteWorkout = (id) => {
    const workouts = getWorkouts();
    const filtered = workouts.filter(w => w.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const editWorkout = (id, updatedData) => {
    const workouts = getWorkouts();
    const index = workouts.findIndex(w => w.id === id);
    if (index !== -1) {
        workouts[index] = { ...workouts[index], ...updatedData };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
    }
};

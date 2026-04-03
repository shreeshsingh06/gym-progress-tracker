import { useState, useEffect } from 'react';
import { getWorkouts, saveWorkout, deleteWorkout } from './utils/storage';
import WorkoutLogger from './components/WorkoutLogger';
import ProgressChart from './components/ProgressChart';
import WeeklySummary from './components/WeeklySummary';
import RestTimer from './components/RestTimer';
import { Activity, Trash2, Trophy } from 'lucide-react';

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [filterStr, setFilterStr] = useState('');

  useEffect(() => {
    setWorkouts(getWorkouts().sort((a, b) => new Date(b.date) - new Date(a.date)));
  }, []);

  const handleSaveWorkout = (data) => {
    const newWorkout = saveWorkout(data);
    setWorkouts([newWorkout, ...workouts]);
  };

  const handleDelete = (id) => {
    if(confirm('Delete this workout?')) {
      deleteWorkout(id);
      setWorkouts(workouts.filter(w => w.id !== id));
    }
  };

  return (
    <>
      <div className="background-orb orb-1"></div>
      <div className="background-orb orb-2"></div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <header className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 700, letterSpacing: '-1px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <Activity size={40} color="#a78bfa" />
            Progress <span style={{ background: 'linear-gradient(135deg, #a78bfa, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Tracker</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '0.5rem' }}>Next-gen personalized tracking</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <WorkoutLogger onSave={handleSaveWorkout} />
            <RestTimer />
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <WeeklySummary workouts={workouts} />

            <div className="glass" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                 <input type="text" className="input-field" style={{ width: '100%', padding: '0.8rem 1rem' }} placeholder="Filter chart by exercise..." value={filterStr} onChange={e => setFilterStr(e.target.value)} />
              </div>
              <ProgressChart workouts={workouts} exerciseFilter={filterStr} />
            </div>
          </div>
        </div>

        {/* Timeline Grid (spanning full width below) */}
        <div className="glass animate-fade-in" style={{ padding: '2rem', marginTop: '2rem' }}>
           <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>Workout Timeline</h2>
           {workouts.length === 0 ? (
             <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'center' }}>No workouts yet.</p>
           ) : (
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
               {workouts.map(workout => (
                 <div key={workout.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                   <div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{workout.exerciseName}</h3>
                        {workout.isPR && <Trophy size={16} color="#f59e0b" title="Personal Record" />}
                        <span style={{ fontSize: '0.75rem', background: 'rgba(109,40,217,0.2)', color: '#a78bfa', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>{workout.category}</span>
                     </div>
                     <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                       {new Date(workout.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                     </p>
                     
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.5rem' }}>
                        {workout.setsData.map((s, i) => (
                           <div key={i} style={{ fontSize: '0.9rem', color: '#e2e8f0', display: 'flex', gap: '1rem' }}>
                              <span style={{ color: 'var(--text-secondary)', width: '40px' }}>Set {i+1}</span>
                              <span>{s.reps} reps</span>
                              <span style={{ fontWeight: 600, color: '#a78bfa' }}>{s.weight} kg</span>
                           </div>
                        ))}
                     </div>

                     {workout.notes && <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontStyle: 'italic', marginTop: '1rem', paddingLeft: '0.5rem', borderLeft: '2px solid rgba(255,255,255,0.1)' }}>"{workout.notes}"</p>}
                   </div>
                   <button onClick={() => handleDelete(workout.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', padding: '0.5rem', cursor: 'pointer', opacity: 0.7, transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0.7}>
                     <Trash2 size={20} />
                   </button>
                 </div>
               ))}
             </div>
           )}
        </div>

      </div>
    </>
  );
}

export default App;

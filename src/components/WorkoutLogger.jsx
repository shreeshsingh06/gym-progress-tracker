import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function WorkoutLogger({ onSave }) {
  const [exercise, setExercise] = useState('');
  const [category, setCategory] = useState('Push');
  const [notes, setNotes] = useState('');
  const [isPR, setIsPR] = useState(false);
  const [setsData, setSetsData] = useState([{ reps: '', weight: '' }]);

  const handleAddSet = () => {
    setSetsData([...setsData, { reps: '', weight: '' }]);
  };

  const handleRemoveSet = (index) => {
    if(setsData.length > 1) {
      setSetsData(setsData.filter((_, i) => i !== index));
    }
  };

  const handleSetChange = (index, field, value) => {
    const updatedSets = [...setsData];
    updatedSets[index][field] = value;
    setSetsData(updatedSets);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!exercise || setsData.length === 0) return;
    
    // Validate sets
    const validSets = setsData.filter(s => s.reps !== '' && s.weight !== '');
    if(validSets.length === 0) return;

    onSave({
      exerciseName: exercise,
      category,
      notes,
      isPR,
      setsData: validSets,
      setsCount: validSets.length
    });

    // Reset form
    setExercise('');
    setNotes('');
    setIsPR(false);
    setSetsData([{ reps: '', weight: '' }]);
  };

  return (
    <div className="glass" style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>Log Workout</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Exercise Name</label>
          <input type="text" className="input-field" value={exercise} onChange={e => setExercise(e.target.value)} placeholder="e.g. Bench Press" required />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Category</label>
            <select className="input-field" value={category} onChange={e => setCategory(e.target.value)}>
              <option value="Push">Push</option>
              <option value="Pull">Pull</option>
              <option value="Legs">Legs</option>
              <option value="Core">Core</option>
              <option value="Cardio">Cardio</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '1.5rem', gap: '0.5rem' }}>
             <input type="checkbox" id="isPr" checked={isPR} onChange={e => setIsPR(e.target.checked)} style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--accent)' }} />
             <label htmlFor="isPr" style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>Personal Record?</label>
          </div>
        </div>

        <div>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            Sets
            <button type="button" onClick={handleAddSet} style={{ background: 'transparent', border: 'none', color: '#a78bfa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 600 }}>
              <Plus size={16} /> Add Set
            </button>
          </label>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {setsData.map((set, index) => (
              <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div style={{ minWidth: '24px', color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.9rem' }}>{index + 1}</div>
                <input type="number" className="input-field" placeholder="Reps" value={set.reps} onChange={e => handleSetChange(index, 'reps', e.target.value)} required min="1" />
                <input type="number" className="input-field" placeholder="Weight (kg)" value={set.weight} onChange={e => handleSetChange(index, 'weight', e.target.value)} required min="0" step="0.5" />
                <div style={{ width: '40px', display: 'flex', justifyContent: 'center' }}>
                    {setsData.length > 1 && (
                      <button type="button" onClick={() => handleRemoveSet(index)} style={{ background: 'transparent', border: 'none', color: '#ef4444', padding: '0.5rem', cursor: 'pointer' }}>
                        <Trash2 size={18} />
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Notes</label>
          <textarea className="input-field" value={notes} onChange={e => setNotes(e.target.value)} placeholder="How did it feel?" rows="2" style={{ resize: 'vertical' }}></textarea>
        </div>

        <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>Save Workout</button>
      </form>
    </div>
  );
}

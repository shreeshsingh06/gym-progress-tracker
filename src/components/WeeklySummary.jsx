import { useMemo } from 'react';

export default function WeeklySummary({ workouts }) {
  const stats = useMemo(() => {
    const totals = { volume: 0, sets: 0, reps: 0, prs: 0 };
    
    // Last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentWorkouts = workouts.filter(w => new Date(w.date) >= oneWeekAgo);

    recentWorkouts.forEach(w => {
      if(w.isPR) totals.prs += 1;
      w.setsData.forEach(set => {
        totals.sets += 1;
        totals.reps += Number(set.reps);
        totals.volume += Number(set.reps) * Number(set.weight);
      });
    });

    return totals;
  }, [workouts]);

  return (
    <div className="glass" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
      <div style={{ gridColumn: 'span 2' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Last 7 Days Summary</h3>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Volume</div>
        <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#a78bfa' }}>{stats.volume.toLocaleString()} kg</div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Sets</div>
        <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#3b82f6' }}>{stats.sets}</div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Reps</div>
        <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#10b981' }}>{stats.reps}</div>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>PRs Hit</div>
        <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#f59e0b' }}>{stats.prs}</div>
      </div>
    </div>
  );
}

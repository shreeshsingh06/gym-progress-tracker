import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function ProgressChart({ workouts, exerciseFilter }) {
  const chartData = useMemo(() => {
    let filtered = workouts;
    if (exerciseFilter) {
      filtered = workouts.filter(w => w.exerciseName.toLowerCase().includes(exerciseFilter.toLowerCase()));
    }

    // Sort chronologically
    const sorted = [...filtered].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Limit to latest 14 data points
    const recent = sorted.slice(-14);

    const labels = recent.map(w => {
      const d = new Date(w.date);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    });

    const volumes = recent.map(w => {
       return w.setsData.reduce((total, set) => total + (Number(set.reps) * Number(set.weight)), 0);
    });

    const maxWeights = recent.map(w => {
       return Math.max(...w.setsData.map(s => Number(s.weight)));
    });

    return {
      labels,
      datasets: [
        {
          label: 'Max Weight (kg)',
          data: maxWeights,
          borderColor: '#a78bfa',
          backgroundColor: 'rgba(167, 139, 250, 0.1)',
          yAxisID: 'y',
          tension: 0.3,
          fill: true
        },
        {
          label: 'Volume (kg)',
          data: volumes,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          yAxisID: 'y1',
          tension: 0.3,
        }
      ]
    };
  }, [workouts, exerciseFilter]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        labels: { color: '#94a3b8' }
      }
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(255,255,255,0.05)' }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        ticks: { color: '#a78bfa' },
        grid: { color: 'rgba(255,255,255,0.05)' }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        ticks: { color: '#3b82f6' },
        grid: { drawOnChartArea: false }
      }
    }
  };

  return (
    <div className="glass" style={{ padding: '1.5rem', marginTop: '1.5rem', height: '350px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 600 }}>Progress Overview</h3>
      {chartData.labels.length > 0 ? (
        <div style={{ flex: 1, minHeight: 0 }}>
            <Line data={chartData} options={options} />
        </div>
      ) : (
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: 'auto', marginBottom: 'auto' }}>Log some workouts to visualize your progress!</p>
      )}
    </div>
  );
}

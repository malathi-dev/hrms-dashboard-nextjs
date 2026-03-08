"use client";
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StatsCard({ label, value, total, color }) {
  const percentage = total ? Math.round((value / total) * 100) : 0;
  const data = {
    labels: [label],
    datasets: [
      {
        data: [value, total - value],
        backgroundColor: [color, '#e9ecef'],
        hoverBackgroundColor: [color, '#e9ecef'],
        borderWidth: 0,
      },
    ],
  };
  const options = {
    cutout: '80%',
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <div className="stat-card">
      <div className="circle" style={{ width: '60px', height: '60px' }}>
        <Doughnut data={data} options={options} />
        <span className="number">{percentage}%</span>
      </div>
      <h3>{value}</h3>
      <p className="mb-0 text-muted">{label}</p>
    </div>
  );
}

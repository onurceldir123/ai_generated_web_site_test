"use client";

import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function SensorPanel() {
  const pieData = {
    labels: ['Sıcaklık Sensörü', 'Nem Sensörü', 'Basınç Sensörü', 'Hareket Sensörü'],
    datasets: [{
      data: [12, 8, 6, 4],
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
      ],
      borderWidth: 1,
    }],
  };

  const barData = {
    labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
    datasets: [
      {
        label: 'Sıcaklık Değerleri (°C)',
        data: [22, 19, 24, 25, 28, 30],
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Nem Oranı (%)',
        data: [45, 52, 48, 50, 42, 40],
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Aylık Sensör Verileri',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((sensor) => (
          <div key={sensor} className="bg-white p-6 rounded-lg shadow-sm">
            <h4 className="text-sm font-medium text-gray-500">Sensör {sensor}</h4>
            <p className="text-2xl font-semibold mt-2">24.5°C</p>
            <div className="mt-2 text-sm text-green-600">↑ 1.2°C</div>
            <div className="mt-4 text-xs text-gray-500">Son güncelleme: 5 dk önce</div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Sensör Dağılımı</h3>
          <div className="h-[300px] flex items-center justify-center">
            <Pie data={pieData} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Sensör Geçmişi</h3>
          <div className="h-[300px] flex items-center justify-center">
            <Bar options={barOptions} data={barData} />
          </div>
        </div>
      </div>
    </div>
  );
} 
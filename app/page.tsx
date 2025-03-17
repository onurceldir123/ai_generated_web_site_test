"use client";

import { useState, useRef, useEffect } from 'react';
import { FiUsers, FiActivity, FiMapPin, FiMenu, FiX, FiHome, FiPlay, FiZap, FiCode } from 'react-icons/fi';
import UserPanel from '@/components/UserPanel';
import SensorPanel from '@/components/SensorPanel';
import LocationPanel from '@/components/LocationPanel';
import SnakeGame from '@/components/SnakeGame';
import SpaceWar from '@/components/SpaceWar';
import Tetris from '@/components/Tetris';
import CQuiz from '@/components/CQuiz';
import AlgorithmQuiz from '@/components/AlgorithmQuiz';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('users');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);

  // Yılan oyunu için gerekli state'ler
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState('right');
  const [gameOver, setGameOver] = useState(false);

  // Pie Chart verisi
  const pieData = {
    labels: ['Sıcaklık Sensörü', 'Nem Sensörü', 'Basınç Sensörü', 'Hareket Sensörü'],
    datasets: [
      {
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
      },
    ],
  };

  // Bar Chart verisi
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

  // Oyun döngüsü
  useEffect(() => {
    if (activeTab !== 'game' || !gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = setInterval(() => {
      if (gameOver) {
        clearInterval(gameLoop);
        return;
      }

      // Canvas'ı temizle
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Yılanı çiz
      ctx.fillStyle = '#00ff00';
      snake.forEach(segment => {
        ctx.fillRect(segment.x * 20, segment.y * 20, 18, 18);
      });

      // Yemi çiz
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(food.x * 20, food.y * 20, 18, 18);

      // Yılanı hareket ettir
      const newSnake = [...snake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
      }

      // Çarpışma kontrolü
      if (
        head.x < 0 || head.x >= canvas.width / 20 ||
        head.y < 0 || head.y >= canvas.height / 20 ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        return;
      }

      newSnake.unshift(head);

      // Yem yeme kontrolü
      if (head.x === food.x && head.y === food.y) {
        setFood({
          x: Math.floor(Math.random() * (canvas.width / 20)),
          y: Math.floor(Math.random() * (canvas.height / 20))
        });
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    }, 100);

    // Klavye kontrolü
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'down') setDirection('up'); break;
        case 'ArrowDown': if (direction !== 'up') setDirection('down'); break;
        case 'ArrowLeft': if (direction !== 'right') setDirection('left'); break;
        case 'ArrowRight': if (direction !== 'left') setDirection('right'); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [snake, food, direction, gameOver, activeTab, gameStarted]);

  const startNewGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDirection('right');
    setGameOver(false);
    setGameStarted(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 z-30`}>
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <FiHome className="text-2xl" />
            <h1 className="text-xl font-bold">Yönetim Paneli</h1>
          </div>
        </div>
        <nav className="mt-6">
          <div
            onClick={() => setActiveTab('users')}
            className={`p-4 cursor-pointer flex items-center space-x-3 ${activeTab === 'users' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
          >
            <FiUsers className="text-xl" />
            <span>Kullanıcı Yönetimi</span>
          </div>
          <div
            onClick={() => setActiveTab('sensors')}
            className={`p-4 cursor-pointer flex items-center space-x-3 ${activeTab === 'sensors' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
          >
            <FiActivity className="text-xl" />
            <span>Sensör Bilgileri</span>
          </div>
          <div
            onClick={() => setActiveTab('locations')}
            className={`p-4 cursor-pointer flex items-center space-x-3 ${activeTab === 'locations' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
          >
            <FiMapPin className="text-xl" />
            <span>Yerleşke Bilgileri</span>
          </div>
          <div
            onClick={() => setActiveTab('game')}
            className={`p-4 cursor-pointer flex items-center space-x-3 ${activeTab === 'game' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
          >
            <FiPlay className="text-xl" />
            <span>Yılan Oyunu</span>
          </div>
          <div
            onClick={() => setActiveTab('spacewar')}
            className={`p-4 cursor-pointer flex items-center space-x-3 ${activeTab === 'spacewar' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
          >
            <FiZap className="text-xl" />
            <span>Uzay Savaşı</span>
          </div>
          <div
            onClick={() => setActiveTab('tetris')}
            className={`p-4 cursor-pointer flex items-center space-x-3 ${activeTab === 'tetris' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
          >
            <FiZap className="text-xl" />
            <span>Tetris</span>
          </div>
          <div
            onClick={() => setActiveTab('cquiz')}
            className={`p-4 cursor-pointer flex items-center space-x-3 ${activeTab === 'cquiz' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
          >
            <FiCode className="text-xl" />
            <span>C Quiz</span>
          </div>
          <div
            onClick={() => setActiveTab('algorithm')}
            className={`p-4 cursor-pointer flex items-center space-x-3 ${activeTab === 'algorithm' ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
          >
            <FiCode className="text-xl" />
            <span>Algoritma Soruları</span>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* Header */}
        <header className="bg-white shadow-sm fixed right-0 left-0 lg:left-64 z-20">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="lg:hidden"
            >
              {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            <h2 className="text-xl font-semibold text-gray-800">
              {activeTab === 'users' && 'Kullanıcı Yönetimi'}
              {activeTab === 'sensors' && 'Sensör Bilgileri'}
              {activeTab === 'locations' && 'Yerleşke Bilgileri'}
              {activeTab === 'game' && 'Yılan Oyunu'}
              {activeTab === 'spacewar' && 'Uzay Savaşı'}
              {activeTab === 'tetris' && 'Tetris'}
              {activeTab === 'cquiz' && 'C Quiz'}
              {activeTab === 'algorithm' && 'Algoritma Soruları'}
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Admin</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="pt-20 p-6">
          {activeTab === 'users' && <UserPanel />}
          {activeTab === 'sensors' && <SensorPanel />}
          {activeTab === 'locations' && <LocationPanel />}
          {activeTab === 'game' && <SnakeGame />}
          {activeTab === 'spacewar' && <SpaceWar />}
          {activeTab === 'tetris' && <Tetris />}
          {activeTab === 'cquiz' && <CQuiz />}
          {activeTab === 'algorithm' && <AlgorithmQuiz />}
        </main>
      </div>
    </div>
  );
}

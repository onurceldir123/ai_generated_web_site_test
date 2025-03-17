"use client";

import { useEffect, useRef, useState } from 'react';

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState('right');
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = setInterval(() => {
      if (gameOver) {
        clearInterval(gameLoop);
        return;
      }

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff00';
      snake.forEach(segment => {
        ctx.fillRect(segment.x * 20, segment.y * 20, 18, 18);
      });

      ctx.fillStyle = '#ff0000';
      ctx.fillRect(food.x * 20, food.y * 20, 18, 18);

      const newSnake = [...snake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
      }

      if (
        head.x < 0 || head.x >= canvas.width / 20 ||
        head.y < 0 || head.y >= canvas.height / 20 ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        return;
      }

      newSnake.unshift(head);

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
  }, [snake, food, direction, gameOver, gameStarted]);

  const startNewGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDirection('right');
    setGameOver(false);
    setGameStarted(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">Yılan Oyunu</h3>
        {gameOver && <p className="text-red-500 mt-2">Oyun Bitti!</p>}
        {!gameStarted && (
          <button
            onClick={startNewGame}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Oyunu Başlat
          </button>
        )}
      </div>
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width="400"
          height="400"
          className="border border-gray-300"
        />
      </div>
      <div className="text-center mt-4 text-sm text-gray-600">
        Yön tuşlarını kullanarak yılanı kontrol edin
      </div>
    </div>
  );
} 
"use client";

import { useEffect, useRef, useState } from 'react';

interface Spaceship {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Bullet {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Enemy {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function SpaceWar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const [spaceship, setSpaceship] = useState<Spaceship>({
    x: 200,
    y: 350,
    width: 50,
    height: 50
  });

  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);

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

      // Canvas'ı temizle
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Uzay gemisini çiz
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);

      // Mermileri ve düşmanları güncelle
      setBullets(prevBullets => {
        const newBullets = prevBullets
          .map(bullet => ({ ...bullet, y: bullet.y - 5 }))
          .filter(bullet => bullet.y > 0);

        setEnemies(prevEnemies => {
          let updatedEnemies = [...prevEnemies];
          
          // Çarpışma kontrolü
          newBullets.forEach(bullet => {
            updatedEnemies = updatedEnemies.filter(enemy => !(
              bullet.x < enemy.x + enemy.width &&
              bullet.x + bullet.width > enemy.x &&
              bullet.y < enemy.y + enemy.height &&
              bullet.y + bullet.height > enemy.y
            ));
          });

          // Düşmanları hareket ettir ve yeni düşman ekle
          updatedEnemies = updatedEnemies
            .map(enemy => ({ ...enemy, y: enemy.y + 2 }))
            .filter(enemy => enemy.y < canvas.height);

          if (Math.random() < 0.02) {
            updatedEnemies.push({
              x: Math.random() * (canvas.width - 30),
              y: 0,
              width: 30,
              height: 30
            });
          }

          return updatedEnemies;
        });

        return newBullets;
      });

      // Mermileri çiz
      ctx.fillStyle = '#ffffff';
      bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      });

      // Düşmanları çiz
      ctx.fillStyle = '#ff0000';
      enemies.forEach(enemy => {
        drawEnemy(ctx, enemy);
      });

      // Uzay gemisi çarpışma kontrolü
      enemies.forEach(enemy => {
        if (
          enemy.x < spaceship.x + spaceship.width &&
          enemy.x + enemy.width > spaceship.x &&
          enemy.y < spaceship.y + spaceship.height &&
          enemy.y + enemy.height > spaceship.y
        ) {
          setGameOver(true);
        }
      });

    }, 1000 / 60);

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          setSpaceship(prev => ({
            ...prev,
            x: Math.max(0, prev.x - 40)
          }));
          break;
        case 'ArrowRight':
          setSpaceship(prev => ({
            ...prev,
            x: Math.min(canvas.width - prev.width, prev.x + 40)
          }));
          break;
        case ' ':
          setBullets(prev => [
            ...prev,
            {
              x: spaceship.x + spaceship.width / 2 - 2,
              y: spaceship.y,
              width: 4,
              height: 10
            }
          ]);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [spaceship, bullets, enemies, gameStarted, gameOver]);

  const startNewGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setSpaceship({
      x: 200,
      y: 350,
      width: 50,
      height: 50
    });
    setBullets([]);
    setEnemies([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">Uzay Savaşı</h3>
        <p className="text-gray-600 mt-2">Skor: {score}</p>
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
          className="border border-gray-300 bg-black"
        />
      </div>
      <div className="text-center mt-4 text-sm text-gray-600">
        <p>Kontroller:</p>
        <p>← → : Hareket | Boşluk : Ateş</p>
      </div>
    </div>
  );
}

// Düşmanları daire şeklinde çiz
const drawEnemy = (ctx: CanvasRenderingContext2D, enemy: Enemy) => {
  ctx.beginPath();
  ctx.arc(
    enemy.x + enemy.width / 2,
    enemy.y + enemy.height / 2,
    enemy.width / 2,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = '#ff0000';
  ctx.fill();
  ctx.closePath();
}; 
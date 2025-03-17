"use client";

import { useEffect, useRef, useState } from 'react';

interface Block {
  x: number;
  y: number;
  color: string;
}

interface Tetromino {
  blocks: Block[];
  type: string;
}

interface HighScore {
  username: string;
  score: number;
  date: string;
}

export default function Tetris() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [currentPiece, setCurrentPiece] = useState<Tetromino | null>(null);
  const [gameBoard, setGameBoard] = useState<string[][]>(
    Array(20).fill(null).map(() => Array(10).fill(''))
  );
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [username, setUsername] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  const BLOCK_SIZE = 30;
  const BOARD_WIDTH = 10;
  const BOARD_HEIGHT = 20;

  const TETROMINOES = {
    I: {
      blocks: [
        { x: 0, y: 0, color: '#00f0f0' },
        { x: 1, y: 0, color: '#00f0f0' },
        { x: 2, y: 0, color: '#00f0f0' },
        { x: 3, y: 0, color: '#00f0f0' }
      ],
      type: 'I'
    },
    O: {
      blocks: [
        { x: 0, y: 0, color: '#f0f000' },
        { x: 1, y: 0, color: '#f0f000' },
        { x: 0, y: 1, color: '#f0f000' },
        { x: 1, y: 1, color: '#f0f000' }
      ],
      type: 'O'
    },
    T: {
      blocks: [
        { x: 1, y: 0, color: '#a000f0' },
        { x: 0, y: 1, color: '#a000f0' },
        { x: 1, y: 1, color: '#a000f0' },
        { x: 2, y: 1, color: '#a000f0' }
      ],
      type: 'T'
    }
  };

  const createNewPiece = () => {
    const types = Object.keys(TETROMINOES);
    const type = types[Math.floor(Math.random() * types.length)];
    const piece = JSON.parse(JSON.stringify(TETROMINOES[type as keyof typeof TETROMINOES]));
    piece.blocks = piece.blocks.map((block: Block) => ({
      ...block,
      x: block.x + Math.floor(BOARD_WIDTH / 2) - 1,
      y: block.y
    }));
    return piece;
  };

  const drawBoard = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, BOARD_WIDTH * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE);

    // Yerleşmiş blokları çiz
    gameBoard.forEach((row, y) => {
      row.forEach((color, x) => {
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
        }
      });
    });

    // Aktif parçayı çiz
    if (currentPiece) {
      currentPiece.blocks.forEach(block => {
        ctx.fillStyle = block.color;
        ctx.fillRect(
          block.x * BLOCK_SIZE,
          block.y * BLOCK_SIZE,
          BLOCK_SIZE - 1,
          BLOCK_SIZE - 1
        );
      });
    }
  };

  const moveDown = () => {
    if (!currentPiece || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const newPiece = {
      ...currentPiece,
      blocks: currentPiece.blocks.map(block => ({ ...block, y: block.y + 1 }))
    };

    if (isValidMove(newPiece)) {
      setCurrentPiece(newPiece);
      drawBoard(ctx);
    } else {
      // Parçayı yerleştir
      const newBoard = [...gameBoard];
      currentPiece.blocks.forEach(block => {
        if (block.y >= 0) {
          newBoard[block.y][block.x] = block.color;
        }
      });
      setGameBoard(newBoard);

      // Tamamlanan satırları kontrol et
      const completedRows = newBoard.reduce((acc, row, index) => {
        if (row.every(cell => cell !== '')) acc.push(index);
        return acc;
      }, [] as number[]);

      if (completedRows.length > 0) {
        const updatedBoard = newBoard.filter((_, index) => !completedRows.includes(index));
        const newRows = Array(completedRows.length).fill(null).map(() => Array(10).fill(''));
        setGameBoard([...newRows, ...updatedBoard]);
        setScore(prev => prev + completedRows.length * 100);
      }

      // Yeni parça oluştur
      const nextPiece = createNewPiece();
      if (!isValidMove(nextPiece)) {
        setShowNameInput(true);
        setGameOver(true);
      } else {
        setCurrentPiece(nextPiece);
      }
    }
  };

  const isValidMove = (piece: Tetromino) => {
    return piece.blocks.every(block => {
      const inBounds = block.x >= 0 && block.x < BOARD_WIDTH && block.y < BOARD_HEIGHT;
      const notOverlapping = block.y < 0 || !gameBoard[block.y]?.[block.x];
      return inBounds && notOverlapping;
    });
  };

  const moveHorizontal = (direction: number) => {
    if (!currentPiece || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const newPiece = {
      ...currentPiece,
      blocks: currentPiece.blocks.map(block => ({
        ...block,
        x: block.x + direction
      }))
    };

    if (isValidMove(newPiece)) {
      setCurrentPiece(newPiece);
      drawBoard(ctx); // Hemen yeniden çiz
    }
  };

  const rotatePiece = () => {
    if (!currentPiece || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Merkez bloğu bul (genellikle ikinci blok)
    const center = currentPiece.blocks[1];

    // Yeni döndürülmüş parçayı oluştur
    const newPiece = {
      ...currentPiece,
      blocks: currentPiece.blocks.map(block => {
        const relativeX = block.x - center.x;
        const relativeY = block.y - center.y;
        return {
          ...block,
          x: center.x - relativeY,
          y: center.y + relativeX
        };
      })
    };

    // Eğer döndürme geçerliyse uygula
    if (isValidMove(newPiece)) {
      setCurrentPiece(newPiece);
      drawBoard(ctx);
    }
  };

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = setInterval(() => {
      moveDown();
      drawBoard(ctx);
    }, 300);

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          moveHorizontal(-1);
          break;
        case 'ArrowRight':
          moveHorizontal(1);
          break;
        case 'ArrowDown':
          moveDown();
          moveDown();
          break;
        case 'ArrowUp':
          rotatePiece();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameStarted, gameOver, currentPiece, gameBoard]);

  const startNewGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setShowNameInput(false);
    setUsername('');
    setGameBoard(Array(20).fill(null).map(() => Array(10).fill('')));
    setCurrentPiece(createNewPiece());
  };

  // Yüksek skorları yükle
  useEffect(() => {
    const savedScores = localStorage.getItem('tetrisHighScores');
    if (savedScores) {
      setHighScores(JSON.parse(savedScores));
    }
  }, []);

  // Yeni skoru kaydet
  const saveHighScore = () => {
    if (!username) return;
    
    const newScore: HighScore = {
      username,
      score,
      date: new Date().toLocaleDateString()
    };

    const newHighScores = [...highScores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // En yüksek 5 skoru tut

    setHighScores(newHighScores);
    localStorage.setItem('tetrisHighScores', JSON.stringify(newHighScores));
    setShowNameInput(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">Tetris</h3>
        <p className="text-gray-600 mt-2">Skor: {score}</p>
        
        {gameOver && (
          <div className="mt-4">
            <p className="text-red-500 mb-2">Oyun Bitti!</p>
            {showNameInput ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && username.trim()) {
                      saveHighScore();
                    }
                  }}
                  placeholder="Kullanıcı adınız"
                  className="px-3 py-2 border rounded"
                />
                <button
                  onClick={saveHighScore}
                  className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Skoru Kaydet
                </button>
              </div>
            ) : (
              <button
                onClick={startNewGame}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Tekrar Oyna
              </button>
            )}
          </div>
        )}

        {!gameStarted && !gameOver && (
          <button
            onClick={startNewGame}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Oyunu Başlat
          </button>
        )}
      </div>

      <div className="flex justify-center mb-6">
        <canvas
          ref={canvasRef}
          width={BOARD_WIDTH * BLOCK_SIZE}
          height={BOARD_HEIGHT * BLOCK_SIZE}
          className="border border-gray-300"
        />
      </div>

      <div className="text-center mb-6 text-sm text-gray-600">
        <p>Kontroller:</p>
        <p>← → : Hareket | ↓ : Hızlandır | ↑ : Döndür</p>
      </div>

      {/* Yüksek Skorlar Tablosu */}
      <div className="mt-6">
        <h4 className="font-semibold mb-2 text-center">Yüksek Skorlar</h4>
        <div className="border rounded overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2">Sıra</th>
                <th className="px-4 py-2">İsim</th>
                <th className="px-4 py-2">Skor</th>
                <th className="px-4 py-2">Tarih</th>
              </tr>
            </thead>
            <tbody>
              {highScores.map((score, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{score.username}</td>
                  <td className="px-4 py-2">{score.score}</td>
                  <td className="px-4 py-2">{score.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 
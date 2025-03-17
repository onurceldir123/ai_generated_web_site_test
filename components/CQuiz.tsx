"use client";

import { useState } from 'react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "C dilinde bir pointer değişkenin boyutu neye bağlıdır?",
    options: [
      "İşaretçinin gösterdiği verinin tipine",
      "İşletim sisteminin mimarisine",
      "Derleyiciye",
      "Değişkenin isminin uzunluğuna"
    ],
    correctAnswer: 1,
    explanation: "Pointer değişkeninin boyutu, işletim sisteminin mimarisine bağlıdır. 32-bit sistemlerde 4 byte, 64-bit sistemlerde 8 byte'tır. İşaret ettiği verinin tipi pointer'ın boyutunu etkilemez."
  },
  {
    id: 2,
    question: "Aşağıdakilerden hangisi C'de geçerli bir değişken ismi değildir?",
    options: [
      "_variable",
      "variable123",
      "123variable",
      "my_variable"
    ],
    correctAnswer: 2,
    explanation: "C dilinde değişken isimleri _ veya harf ile başlamalıdır. '123variable' ve '_variable' geçerli isimlerdir, '123variable' ise geçersiz bir isimdir."
  },
  {
    id: 3,
    question: "C dilinde 'malloc()' fonksiyonu hangi kütüphanede bulunur?",
    options: [
      "<string.h>",
      "<math.h>",
      "<stdlib.h>",
      "<stdio.h>"
    ],
    correctAnswer: 2,
    explanation: "<stdlib.h> kütüphanesinde bulunur. <string.h>, <math.h> ve <stdio.h> kütüphanelerinde bulunmaz."
  },
  {
    id: 4,
    question: "Aşağıdakilerden hangisi C'de bir döngü çeşidi değildir?",
    options: [
      "for",
      "while",
      "foreach",
      "do-while"
    ],
    correctAnswer: 2,
    explanation: "C dilinde 'foreach' döngüsü bulunmaz. 'foreach' döngüsü C++ dilinde kullanılır."
  },
  {
    id: 5,
    question: "C dilinde 'struct' ne için kullanılır?",
    options: [
      "Fonksiyon tanımlamak için",
      "Döngü oluşturmak için",
      "Kullanıcı tanımlı veri tipleri oluşturmak için",
      "Değişken tanımlamak için"
    ],
    correctAnswer: 2,
    explanation: "'struct' anahtar kelimesi, kullanıcı tanımlı veri tipleri oluşturmak için kullanılır. 'struct' anahtar kelimesi ile birlikte bir veri tipi tanımlanır ve bu veri tipi içinde birden fazla değişken veya fonksiyon içerebilir."
  },
  {
    id: 6,
    question: "C'de bir dizinin ilk elemanının adresi neye eşittir?",
    options: [
      "Dizinin kendisine",
      "Dizinin son elemanına",
      "NULL",
      "Dizinin ortasına"
    ],
    correctAnswer: 0,
    explanation: "C dilinde bir dizinin ilk elemanının adresi, dizinin kendisine eşittir. Dizinin ilk elemanının adresini almak için dizinin adını kullanabiliriz."
  },
  {
    id: 7,
    question: "C dilinde 'static' anahtar kelimesi ne işe yarar?",
    options: [
      "Değişkeni sabit yapar",
      "Değişkenin ömrünü program sonuna kadar uzatır",
      "Değişkeni global yapar",
      "Değişkeni yerel yapar"
    ],
    correctAnswer: 1,
    explanation: "'static' anahtar kelimesi, değişkenin ömrünü programın sonuna kadar uzatır. Bu, değişkenin global ya da yerel olarak tanımlanmasına bağlıdır. Global değişkenler 'static' anahtar kelimesi ile tanımlanır ve programın başlangıcından bitişine kadar yaşarlar. Yerel değişkenler de 'static' anahtar kelimesi ile tanımlanabilir ve bu değişkenlerin ömrü, içinde bulunduğu blok için geçerlidir."
  },
  {
    id: 8,
    question: "Aşağıdakilerden hangisi C'de bir önişlemci direktifi değildir?",
    options: [
      "#include",
      "#define",
      "#import",
      "#ifdef"
    ],
    correctAnswer: 2,
    explanation: "#import direktifi C++ dilinde kullanılır ve C dilinde kullanılmaz. #ifdef direktifi, derleyiciye belirli bir ifadeyi derlemek için söylemek için kullanılır ve C dilinde kullanılmaz."
  },
  {
    id: 9,
    question: "C dilinde 'void' pointer nedir?",
    options: [
      "Boş pointer",
      "Herhangi bir veri tipini gösteren pointer",
      "NULL pointer",
      "Geçersiz pointer"
    ],
    correctAnswer: 1,
    explanation: "'void' pointer, herhangi bir veri tipini gösteren pointer'ı ifade eder. Bu, genellikle genel amaçlı işaretçiler için kullanılır ve farklı veri tiplerini işaret etmek için kullanılabilir."
  },
  {
    id: 10,
    question: "C'de bir fonksiyonun birden fazla değer döndürmesi için ne kullanılır?",
    options: [
      "return array",
      "multiple return",
      "pointer veya struct",
      "yield"
    ],
    correctAnswer: 2,
    explanation: "C dilinde bir fonksiyonun birden fazla değer döndürmesi için pointer veya struct kullanılabilir. 'return array' ve 'multiple return' terimleri C dilinde kullanılmaz. 'yield' terimi Python dilinde kullanılır ve C dilinde kullanılmaz."
  }
];

export default function CQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);

  const handleAnswerClick = (selectedAnswer: number) => {
    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    setLastAnswerCorrect(isCorrect);
    setShowExplanation(true);

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      setShowExplanation(false);
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
      } else {
        setShowScore(true);
      }
    }, 3000);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setAnswers([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
      {showScore ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Tamamlandı!</h2>
          <p className="text-xl mb-4">
            Skorunuz: {score} / {questions.length}
          </p>
          <button
            onClick={restartQuiz}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Tekrar Başla
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              Soru {currentQuestion + 1}/{questions.length}
            </h2>
            <p className="text-lg">{questions[currentQuestion].question}</p>
          </div>
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                disabled={showExplanation}
                className={`w-full text-left p-3 rounded ${
                  answers[currentQuestion] === index
                    ? showExplanation
                      ? index === questions[currentQuestion].correctAnswer
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      : 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          {showExplanation && (
            <div className={`mt-4 p-4 rounded ${
              lastAnswerCorrect ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <p className="font-semibold mb-2">
                {lastAnswerCorrect ? '✓ Doğru!' : '✗ Yanlış!'}
              </p>
              <p>{questions[currentQuestion].explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 
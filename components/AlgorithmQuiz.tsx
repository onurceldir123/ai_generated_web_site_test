"use client";

import { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface TestCase {
  input: any[];
  expected: any;
}

interface Question {
  id: number;
  question: string;
  startingCode: string;
  expectedOutput: string;
  hint: string;
  solution: string;
  explanation: string;
  testCases: TestCase[];
  testFunction: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "Verilen bir dizideki en büyük ve en küçük sayıyı bulan bir C fonksiyonu yazın.",
    startingCode: 
`void findMinMax(int arr[], int size, int* min, int* max) {
    // Kodunuzu buraya yazın
}`,
    expectedOutput: "Dizi: [5,3,8,1,9,2] için\nEn küçük: 1\nEn büyük: 9",
    hint: "Diziyi tek bir döngüde tarayarak her elemanı min ve max ile karşılaştırın.",
    solution:
`void findMinMax(int arr[], int size, int* min, int* max) {
    *min = arr[0];
    *max = arr[0];
    for(int i = 1; i < size; i++) {
        if(arr[i] < *min) *min = arr[i];
        if(arr[i] > *max) *max = arr[i];
    }
}`,
    explanation: "Bu çözüm O(n) karmaşıklığında çalışır. Dizinin ilk elemanını hem min hem max olarak alıp, diğer elemanları bunlarla karşılaştırırız.",
    testCases: [
      {
        input: [[5,3,8,1,9,2], 6],
        expected: { min: 1, max: 9 }
      },
      {
        input: [[1,1,1], 3],
        expected: { min: 1, max: 1 }
      }
    ],
    testFunction: `
      function testFindMinMax(userCode) {
        try {
          const testCases = [
            { arr: [5,3,8,1,9,2], size: 6, expected: { min: 1, max: 9 } },
            { arr: [1,1,1], size: 3, expected: { min: 1, max: 1 } }
          ];

          for (const test of testCases) {
            let min = Infinity, max = -Infinity;
            eval(userCode);
            eval(\`findMinMax(test.arr, test.size, (v) => min = v, (v) => max = v)\`);
            
            if (min !== test.expected.min || max !== test.expected.max) {
              return {
                success: false,
                message: \`Başarısız: [[\${test.arr}]] için\nBeklenen: min=\${test.expected.min}, max=\${test.expected.max}\nAlınan: min=\${min}, max=\${max}\`
              };
            }
          }
          
          return { success: true, message: "Tüm test durumları başarılı!" };
        } catch (error) {
          return { success: false, message: \`Hata: \${error.message}\` };
        }
      }
    `
  },
  {
    id: 2,
    question: "Verilen bir stringin palindrom olup olmadığını kontrol eden bir C fonksiyonu yazın.",
    startingCode:
`int isPalindrome(char str[]) {
    // Kodunuzu buraya yazın
    return 0;
}`,
    expectedOutput: '"radar" için: 1\n"hello" için: 0',
    hint: "İki pointer kullanarak stringin başından ve sonundan karşılaştırma yapın.",
    solution:
`int isPalindrome(char str[]) {
    int i = 0;
    int j = strlen(str) - 1;
    
    while(i < j) {
        if(str[i] != str[j]) return 0;
        i++;
        j--;
    }
    return 1;
}`,
    explanation: "Bu çözüm O(n/2) karmaşıklığında çalışır. İki pointer kullanarak stringin başından ve sonundan karakterleri karşılaştırırız.",
    testCases: [
      {
        input: ["radar"],
        expected: 1
      },
      {
        input: ["hello"],
        expected: 0
      },
      {
        input: ["level"],
        expected: 1
      }
    ],
    testFunction: `
      function testIsPalindrome(userCode) {
        try {
          const testCases = [
            { str: "radar", expected: 1 },
            { str: "hello", expected: 0 },
            { str: "level", expected: 1 }
          ];

          for (const test of testCases) {
            eval(userCode);
            const result = eval(\`isPalindrome("\${test.str}")\`);
            
            if (result !== test.expected) {
              return {
                success: false,
                message: \`Başarısız: "\${test.str}" için\nBeklenen: \${test.expected}\nAlınan: \${result}\`
              };
            }
          }
          
          return { success: true, message: "Tüm test durumları başarılı!" };
        } catch (error) {
          return { success: false, message: \`Hata: \${error.message}\` };
        }
      }
    `
  }
  // Daha fazla soru eklenebilir
];

const compileAndRunCode = async (code: string, testCases: any[]) => {
  // Hangi fonksiyonun kullanıldığını belirle
  const prototypes = [];
  if (code.includes('findMinMax')) {
    prototypes.push('void findMinMax(int arr[], int size, int* min, int* max);');
  }
  if (code.includes('isPalindrome')) {
    prototypes.push('int isPalindrome(char str[]);');
  }

  const fullCode = `
    #include <stdio.h>
    #include <string.h>
    #include <emscripten.h>

    // Fonksiyon prototipleri
    ${prototypes.join('\n    ')}

    ${code}

    // Test için örnek main fonksiyonu
    int main() {
      ${code.includes('findMinMax') ? `
      // findMinMax testi
      int arr[] = {5, 3, 8, 1, 9, 2};
      int min, max;
      findMinMax(arr, 6, &min, &max);
      printf("Test dizisi: [5,3,8,1,9,2]\\n");
      printf("En küçük: %d\\nEn büyük: %d\\n", min, max);
      ` : ''}

      ${code.includes('isPalindrome') ? `
      // isPalindrome testi
      char str1[] = "radar";
      char str2[] = "hello";
      printf("\\n'%s' palindrom mu? %s\\n", str1, isPalindrome(str1) ? "Evet" : "Hayır");
      printf("'%s' palindrom mu? %s\\n", str2, isPalindrome(str2) ? "Evet" : "Hayır");
      ` : ''}

      return 0;
    }
  `;

  try {
    const response = await fetch('/api/compile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: fullCode, testCases }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      message: `Derleme hatası: ${(error as Error).message}`
    };
  }
};

export default function AlgorithmQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userCode, setUserCode] = useState(questions[0].startingCode);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setUserCode(questions[currentQuestion + 1].startingCode);
      setShowHint(false);
      setShowSolution(false);
      setShowExplanation(false);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setUserCode(questions[currentQuestion - 1].startingCode);
      setShowHint(false);
      setShowSolution(false);
      setShowExplanation(false);
    }
  };

  const runTests = async () => {
    setIsCompiling(true);
    setTestResult(null);

    try {
      const result = await compileAndRunCode(userCode, questions[currentQuestion].testCases);
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: `Hata: ${(error as Error).message}`
      });
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Algoritma Sorusu {currentQuestion + 1}/{questions.length}
        </h2>
        <p className="text-lg mb-4">{questions[currentQuestion].question}</p>
        
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Beklenen Çıktı:</h3>
          <pre className="bg-gray-100 p-3 rounded">{questions[currentQuestion].expectedOutput}</pre>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Kodunuz:</h3>
          <textarea
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            className="w-full h-48 p-3 font-mono bg-gray-900 text-white rounded"
          />
          <button
            onClick={runTests}
            disabled={isCompiling}
            className={`mt-2 px-4 py-2 rounded ${
              isCompiling 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-yellow-500 hover:bg-yellow-600'
            } text-white`}
          >
            {isCompiling ? 'Derleniyor...' : 'Kodu Test Et'}
          </button>
        </div>

        {testResult && (
          <div className={`mb-4 p-4 rounded ${
            testResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <h3 className="font-semibold mb-2">
              {testResult.success ? '✓ Test Başarılı!' : '✗ Test Başarısız!'}
            </h3>
            <pre className="whitespace-pre-wrap">{testResult.message}</pre>
          </div>
        )}

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setShowHint(!showHint)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {showHint ? 'İpucunu Gizle' : 'İpucu Göster'}
          </button>
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            {showSolution ? 'Çözümü Gizle' : 'Çözümü Göster'}
          </button>
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            {showExplanation ? 'Açıklamayı Gizle' : 'Açıklamayı Göster'}
          </button>
        </div>

        {showHint && (
          <div className="mb-4 p-4 bg-blue-100 rounded">
            <h3 className="font-semibold mb-2">İpucu:</h3>
            <p>{questions[currentQuestion].hint}</p>
          </div>
        )}

        {showSolution && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Çözüm:</h3>
            <SyntaxHighlighter language="c" style={tomorrow}>
              {questions[currentQuestion].solution}
            </SyntaxHighlighter>
          </div>
        )}

        {showExplanation && (
          <div className="mb-4 p-4 bg-purple-100 rounded">
            <h3 className="font-semibold mb-2">Açıklama:</h3>
            <p>{questions[currentQuestion].explanation}</p>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0}
            className={`px-4 py-2 rounded ${
              currentQuestion === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Önceki Soru
          </button>
          <button
            onClick={handleNextQuestion}
            disabled={currentQuestion === questions.length - 1}
            className={`px-4 py-2 rounded ${
              currentQuestion === questions.length - 1
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Sonraki Soru
          </button>
        </div>
      </div>
    </div>
  );
} 
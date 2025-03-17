import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { writeFile, unlink } from 'fs/promises';
import { promisify } from 'util';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  const tempDir = os.tmpdir();
  const timestamp = Date.now();
  const sourceFile = path.join(tempDir, `${timestamp}.c`);
  const wasmFile = path.join(tempDir, `${timestamp}.wasm`);
  const outputFile = path.join(tempDir, `${timestamp}.out`);

  try {
    const { code, testCases } = await request.json();

    // Geçici C dosyasını oluştur
    await writeFile(sourceFile, code);

    // Emscripten ile WASM'a derle ve çalıştırılabilir dosya oluştur
    const { stdout, stderr } = await execAsync(
      `emcc ${sourceFile} -o ${outputFile} -s WASM=1 -s EXPORTED_FUNCTIONS="['_main', '_findMinMax', '_isPalindrome']" -s EXPORTED_RUNTIME_METHODS="['ccall', 'cwrap']" -s PRINTF_LONG_DOUBLE=1`
    );

    if (stderr && !stderr.includes('warning')) {
      return NextResponse.json({
        success: false,
        message: `Derleme hatası: ${stderr}`
      });
    }

    // Programı çalıştır ve çıktıyı al
    const { stdout: output, stderr: runError } = await execAsync(`${outputFile}`);

    if (runError) {
      return NextResponse.json({
        success: false,
        message: `Çalıştırma hatası: ${runError}`
      });
    }

    // WASM testlerini çalıştır
    const wasmBuffer = await require('fs').promises.readFile(wasmFile);
    const wasmModule = await WebAssembly.compile(wasmBuffer);
    const instance = await WebAssembly.instantiate(wasmModule, {
      env: {
        memory: new WebAssembly.Memory({ initial: 256 }),
        table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' }),
        printf: (fmt: number, ...args: any[]) => {
          // printf fonksiyonunu simüle et
          console.log(...args);
        }
      }
    });

    // Test durumlarını çalıştır
    const results = testCases.map((test: { input: any[]; expected: any }) => {
      try {
        let result;
        if (code.includes('findMinMax')) {
          const [arr, size] = test.input;
          const memory = new Int32Array(instance.exports.memory.buffer);
          memory.set(arr);
          let min = 0, max = 0;
          (instance.exports.findMinMax as Function)(0, size, min, max);
          result = { min: memory[min/4], max: memory[max/4] };
        } else if (code.includes('isPalindrome')) {
          const str = test.input[0];
          const memory = new Uint8Array(instance.exports.memory.buffer);
          const strPtr = 1024;
          memory.set(new TextEncoder().encode(str), strPtr);
          result = (instance.exports.isPalindrome as Function)(strPtr);
        }

        return {
          input: test.input,
          expected: test.expected,
          actual: result,
          passed: JSON.stringify(result) === JSON.stringify(test.expected),
          output: output // Program çıktısını da ekle
        };
      } catch (error) {
        return {
          input: test.input,
          error: (error as Error).message,
          output: output // Hata durumunda da çıktıyı ekle
        };
      }
    });

    // Geçici dosyaları temizle
    await Promise.all([
      unlink(sourceFile),
      unlink(wasmFile),
      unlink(outputFile)
    ]);

    const allPassed = results.every((r: { passed?: boolean }) => r.passed);

    return NextResponse.json({
      success: allPassed,
      message: allPassed 
        ? "Tüm testler başarılı!" 
        : "Bazı testler başarısız oldu.",
      results,
      programOutput: output // Program çıktısını da döndür
    });

  } catch (error) {
    // Temizlik...
    try {
      await Promise.all([
        unlink(sourceFile),
        unlink(wasmFile),
        unlink(outputFile)
      ]);
    } catch {}

    return NextResponse.json({
      success: false,
      message: `Sunucu hatası: ${(error as Error).message}`
    });
  }
}
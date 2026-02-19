import { spawn } from 'child_process';
import path from 'path';
import { AnalysisResult } from './types';

export async function analyzeCsv(csvPath: string): Promise<AnalysisResult> {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(process.cwd(), 'python-engine', 'main.py');
    const pythonProcess = spawn('python', [pythonScript, csvPath]);

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}: ${stderr}`));
        return;
      }

      try {
        const result = JSON.parse(stdout);
        resolve(result);
      } catch (error) {
        reject(new Error(`Failed to parse Python output: ${error}`));
      }
    });
  });
}

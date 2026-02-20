import { spawn } from 'child_process';
import path from 'path';
import { AnalysisResult } from './types';

export async function analyzeCsv(csvPath: string): Promise<AnalysisResult> {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(process.cwd(), 'python-engine', 'main.py');
    // Use python3 for production environments (Render, etc.)
    const pythonCommand = process.env.NODE_ENV === 'production' ? 'python3' : 'python';
    
    // Set PYTHONPATH to include both the packages and the python-engine directory
    const pythonPath = process.env.NODE_ENV === 'production'
      ? `${path.join(process.cwd(), '.python_packages')}:${path.join(process.cwd(), 'python-engine')}`
      : path.join(process.cwd(), 'python-engine');
    
    const pythonProcess = spawn(pythonCommand, [pythonScript, csvPath], {
      env: {
        ...process.env,
        PYTHONPATH: pythonPath,
      },
    });

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

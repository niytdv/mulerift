import { spawn } from 'child_process';
import path from 'path';
import { AnalysisResult } from './types';

const PYTHON_TIMEOUT = 60000; // 60 seconds max
const MAX_RETRIES = 2;

// Detect Python command based on platform
function getPythonCommand(): string {
  if (process.platform === 'win32') {
    return 'python'; // Windows uses 'python'
  }
  return process.env.NODE_ENV === 'production' ? 'python3' : 'python';
}

export async function analyzeCsv(csvPath: string, retryCount = 0): Promise<AnalysisResult> {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(process.cwd(), 'python-engine', 'main.py');
    const pythonCommand = getPythonCommand();
    
    console.log(`🐍 Starting Python analysis (attempt ${retryCount + 1}/${MAX_RETRIES + 1}) using: ${pythonCommand}`);
    
    const pythonProcess = spawn(pythonCommand, [pythonScript, csvPath], {
      env: { ...process.env, PYTHONUNBUFFERED: '1' },
      timeout: PYTHON_TIMEOUT
    });

    let stdout = '';
    let stderr = '';
    let isResolved = false;

    // Timeout handler
    const timeoutId = setTimeout(() => {
      if (!isResolved) {
        pythonProcess.kill('SIGTERM');
        reject(new Error(`Python process timeout after ${PYTHON_TIMEOUT}ms`));
        isResolved = true;
      }
    }, PYTHON_TIMEOUT);

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pythonProcess.on('close', (code) => {
      clearTimeout(timeoutId);
      
      if (isResolved) return;
      isResolved = true;

      if (code !== 0) {
        const error = new Error(`Python process exited with code ${code}: ${stderr || 'No error output'}`);
        
        // Retry on transient failures
        if (retryCount < MAX_RETRIES && (code === null || code === 1)) {
          console.warn(`⚠️ Python process failed, retrying...`);
          setTimeout(() => {
            analyzeCsv(csvPath, retryCount + 1).then(resolve).catch(reject);
          }, 1000 * (retryCount + 1)); // Exponential backoff
          return;
        }
        
        reject(error);
        return;
      }

      try {
        const result = JSON.parse(stdout);
        console.log(`✅ Python analysis complete`);
        resolve(result);
      } catch (error) {
        reject(new Error(`Failed to parse Python output: ${error}. Output: ${stdout.substring(0, 200)}`));
      }
    });

    pythonProcess.on('error', (error) => {
      clearTimeout(timeoutId);
      if (!isResolved) {
        isResolved = true;
        reject(new Error(`Failed to spawn Python process: ${error.message}. Ensure Python 3 is installed.`));
      }
    });
  });
}

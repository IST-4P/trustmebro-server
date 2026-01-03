import { spawn } from 'child_process';

export async function ffprobeJson(inputPath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const args = [
      '-v',
      'error',
      '-print_format',
      'json',
      '-show_format',
      '-show_streams',
      inputPath,
    ];
    const p = spawn('ffprobe', args, { stdio: ['ignore', 'pipe', 'pipe'] });

    let out = '';
    let err = '';
    p.stdout.on('data', (d) => (out += d.toString()));
    p.stderr.on('data', (d) => (err += d.toString()));

    p.on('close', (code) => {
      if (code !== 0) return reject(new Error(`ffprobe failed: ${err}`));
      resolve(JSON.parse(out));
    });
    p.on('error', reject);
  });
}

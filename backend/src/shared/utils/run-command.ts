import { exec } from 'child_process';

export async function runCommand(
  cmd: string,
): Promise<{ result: string; code: number }> {
  return new Promise((resolve, reject) => {
    const { stdout } = exec(cmd, { encoding: 'buffer' });
    let result = '';
    stdout.on('data', function (data: Buffer) {
      result += data.toString();
    });
    stdout.on('close', function (code: number | null) {
      resolve({ result, code });
    });
    stdout.on('error', function (error: Error) {
      reject(error);
    });
  });
}

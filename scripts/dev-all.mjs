// Starts the Vite site (port 5173) and the local email server (port 3001) together,
// so the booking and contact forms can send while you develop. Stop both with Ctrl+C.
import { spawn } from 'node:child_process';

const processes = [
  ['site ', ['node_modules/vite/bin/vite.js', '--host', '0.0.0.0', '--port', '5173', '--strictPort']],
  ['email', ['--env-file-if-exists=.env.local', 'server/contact.mjs']],
].map(([name, args]) => {
  const child = spawn(process.execPath, args, { stdio: ['ignore', 'pipe', 'pipe'] });
  for (const stream of [child.stdout, child.stderr])
    stream.on('data', (chunk) =>
      process.stdout.write(
        chunk
          .toString()
          .split(/\r?\n/)
          .filter(Boolean)
          .map((line) => `[${name}] ${line}\n`)
          .join(''),
      ),
    );
  child.on('exit', (code) => {
    console.log(`[${name}] stopped${code ? ` (exit ${code})` : ''}`);
    stopAll();
  });
  return child;
});

function stopAll() {
  for (const child of processes) if (child.exitCode === null) child.kill();
}
process.on('SIGINT', () => {
  stopAll();
  process.exit(0);
});

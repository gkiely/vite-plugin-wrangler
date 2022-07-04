/**
 * Description:
 * Run wrangler as a vite plugin
 */

import { spawn } from 'node:child_process';

const wranglerPlugin = ({
  path = 'server/index.ts',
  port = '8080',
  local = true,
} = {}) => {
  return {
    name: 'wrangler',
    async buildStart() {
      // Restart
      if (global.child) global.child.kill();

      // Spawn
      const child = spawn(
        'wrangler',
        ['dev', '--port', port, local ? '--local' : '', path],
        {
          stdio: 'inherit',
        }
      );

      // Log a new line between server and wrangler banner
      if (!!global.child) {
        setTimeout(() => console.log(''));
      }

      // Clean up
      child.on('close', code => {
        if (code === 0 && child.killed) return;
        if (code === 0) process.exit();
      });

      // Set global
      global.child = child;
    },
  };
};

export default wranglerPlugin;

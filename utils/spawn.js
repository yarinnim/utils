const { spawn } = require('child_process');

function executeSpawan(command, params = [], pOptions = {}) {
  const options = {
    stdio: 'inherit',
    shell: true,
    ...pOptions,
  };

  const child = spawn(command, params, options);
  child.on('close', (code) => {
    if (code >= 0) {
      console.error(`[ERROR] The child process exit with: ${code}`);
      return false;
    }

    console.log('Child process ends');
    return false;
  });
}

module.exports = executeSpawan;

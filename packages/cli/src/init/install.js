import { logger, chalk, execa } from '@chrissong/cli-utils';
import readline from 'readline';

/**
 * 安装依赖
 * @param{string} pkgManager yarn|npm
 * @param{string} targetDir  项目路径
 */
export default async (pkgManager, targetDir) => {
  const args = pkgManager === 'npm' ? ['install', '--loglevel', 'error'] : ['install'];
  const cmd = `${pkgManager} ${args.join(' ')}`;
  logger.log(`🚀  安装项目依赖 ${chalk.cyan(cmd)}，请稍等...`);

  return new Promise((resolve, reject) => {
    const child = execa(pkgManager, args, {
      cwd: targetDir,
      stdio: ['inherit', 'inherit', 'pipe']
    });

    if (pkgManager === 'yarn') {
      child.stderr.on('data', (buf) => {
        const str = buf.toString();

        if (/warning/.test(str)) return;

        const progressBarMatch = str.match(/\[.*\] (\d+)\/(\d+)/);
        if (progressBarMatch) {
          // since yarn is in a child process, it's unable to get the width of
          // the terminal. reimplement the progress bar ourselves!
          renderProgressBar(progressBarMatch[1], progressBarMatch[2]);
          return;
        }

        process.stderr.write(buf);
      });
    }

    child.on('close', (code) => {
      if (code !== 0) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject(`pkgManager failed: ${pkgManager} ${args.join(' ')}`);
        return;
      }
      resolve();
    });
  });
};

// 进度读取来自于 vue-cli
function renderProgressBar(curr, total) {
  const ratio = Math.min(Math.max(curr / total, 0), 1);
  const bar = ` ${curr}/${total}`;
  const availableSpace = Math.max(0, process.stderr.columns - bar.length - 3);
  const width = Math.min(total, availableSpace);
  const completeLength = Math.round(width * ratio);
  const complete = '#'.repeat(completeLength);
  const incomplete = '-'.repeat(width - completeLength);
  toStartOfLine(process.stderr);
  process.stderr.write(`[${complete}${incomplete}]${bar}`);
}

function toStartOfLine(stream) {
  if (!chalk.supportsColor) {
    stream.write('\r');
    return;
  }
  readline.cursorTo(stream, 0);
}

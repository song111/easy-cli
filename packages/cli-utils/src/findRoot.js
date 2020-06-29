import path from 'path';
import fs from 'fs-extra';

export default (cwd) => {
  let directory = path.resolve(cwd || '');
  const { root } = path.parse(directory);
  while (true) {
    if (fs.existsSync(path.resolve(directory, 'package.json'))) return directory;
    if (directory === root) return;
    directory = path.dirname(directory);
  }
};

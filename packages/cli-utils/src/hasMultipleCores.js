import os from 'os';

const hasMultipleCores = () => {
  try {
    return os.cpus().length > 1;
  } catch (e) {
    return false;
  }
};

export default hasMultipleCores;

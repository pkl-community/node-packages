import os from 'node:os';

export function getExePath() {
  const arch = os.arch();
  const op = os.platform();

  try {
    return require.resolve(`@pkl-community/pkl-${op}-${arch}/bin/pkl`);
  } catch (e) {
    throw new Error(
      `Couldn't find application binary inside node_modules for ${op}-${arch}`
    );
  }
}

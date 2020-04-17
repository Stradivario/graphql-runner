import { SpawnOptionsWithoutStdio } from 'child_process';

import { executeCommand } from '../helpers/execute';

export const Docker = (
  args: string[] = [],
  options?: SpawnOptionsWithoutStdio,
) => executeCommand('docker', args, options);

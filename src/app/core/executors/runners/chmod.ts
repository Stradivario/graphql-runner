import { SpawnOptionsWithoutStdio } from 'child_process';

import { executeCommand } from '../helpers/execute';

export const Chmod = (
  args: string[] = [],
  options?: SpawnOptionsWithoutStdio,
) => executeCommand('chmod', args, options);

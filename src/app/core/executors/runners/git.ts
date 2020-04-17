import { SpawnOptionsWithoutStdio } from 'child_process';

import { executeCommand } from '../helpers/execute';
export const Git = (
  args: string[] = [],
  options?: SpawnOptionsWithoutStdio,
) => executeCommand('git', args, options);

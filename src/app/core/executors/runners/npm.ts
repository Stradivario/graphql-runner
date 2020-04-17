import { SpawnOptionsWithoutStdio } from 'child_process';

import { executeCommand } from '../helpers/execute';
export const Npm = (
  args: string[] = [],
  options?: SpawnOptionsWithoutStdio,
) => executeCommand('npm', args, options);

import { SpawnOptionsWithoutStdio } from 'child_process';

import { executeCommand } from '../helpers/execute';

export const MakeDir = (
  args: string[] = [],
  options?: SpawnOptionsWithoutStdio,
) => executeCommand('mkdir', args, options);

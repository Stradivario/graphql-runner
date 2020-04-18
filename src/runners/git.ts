import { executeCommand } from '@gapi/cli-builder';
import { SpawnOptionsWithoutStdio } from 'child_process';

export const Git = (
  args: string[] = [],
  options?: SpawnOptionsWithoutStdio,
) => executeCommand('git', args, options);

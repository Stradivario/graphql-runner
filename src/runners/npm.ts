import { executeCommand } from '@gapi/cli-builder';
import { SpawnOptionsWithoutStdio } from 'child_process';

export const Npm = (
  args: string[] = [],
  options?: SpawnOptionsWithoutStdio,
) => executeCommand('npm', args, options);

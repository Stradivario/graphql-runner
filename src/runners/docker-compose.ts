import { executeCommand } from '@gapi/cli-builder';
import { SpawnOptionsWithoutStdio } from 'child_process';

export const DockerCompose = (
  args: string[] = [],
  options?: SpawnOptionsWithoutStdio,
) => executeCommand('docker-compose', args, options);

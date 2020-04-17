import { SpawnOptionsWithoutStdio } from 'child_process';

import { executeCommand } from '../helpers/execute';

export const DockerCompose = (
  args: string[] = [],
  options?: SpawnOptionsWithoutStdio,
) => executeCommand('docker-compose', args, options);

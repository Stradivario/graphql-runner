import {
  Bootstrap,
  CLIBuilder,
  Environment,
  ProcessReturn,
} from '@gapi/cli-builder';

import { Docker, DockerCompose, Git, MakeDir, Npm } from './runners';

export enum Commands {
  GIT = 1,
  NPM = 2,
  DOCKER = 3,
  DOCKER_COMPOSE = 4,
  MKDIR = 5,
  CHMOD = 6,
}

Bootstrap(
  CLIBuilder.forRoot<typeof Commands, Promise<ProcessReturn>>(
    {
      GIT: async (args: string[]) => {
        console.log('[RUN_GIT]: started arguments: ', args);
        const data = await Git(args);
        console.log('[RUN_GIT]: exited');
        return data;
      },
      NPM: async (args: string[]) => {
        console.log('[RUN_NPM]: started arguments: ', args);
        const data = await Npm(args);
        console.log('[RUN_NPM]: exited');
        return data;
      },
      DOCKER: async (args: string[]) => {
        console.log('[RUN_DOCKER]: started arguments: ', args);
        const data = await Docker(args);
        console.log('[RUN_DOCKER]: exited');
        return data;
      },
      MKDIR: async (args: string[]) => {
        console.log('[RUN_DOCKER]: started arguments: ', args);
        const data = await MakeDir(args);
        console.log('[RUN_DOCKER]: exited');
        return data;
      },
      CHMOD: async (args: string[]) => {
        console.log('[RUN_DOCKER]: started arguments: ', args);
        const data = await MakeDir(args);
        console.log('[RUN_DOCKER]: exited');
        return data;
      },
      DOCKER_COMPOSE: async (args: string[]) => {
        console.log(
          '[RUN_DOCKER_COMPOSE]: started arguments: ',
          args,
        );
        const data = await DockerCompose(args);
        console.log('[RUN_DOCKER_COMPOSE]: exited');
        return data;
      },
    },
    Commands,
  ),
).subscribe(() => {
  if (Environment.SUBSCRIPTION_URI) {
    console.log(
      'STARTED_SUBSCRIPTIONS:',
      Environment.SUBSCRIPTION_URI,
    );
  } else {
    console.log(
      'SIGNAL_MAIN_API_STARTED',
      `Running at http://localhost:${Environment.API_PORT}`,
    );
  }
});

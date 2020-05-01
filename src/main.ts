import {
  Bootstrap,
  CLIBuilder,
  Environment,
} from '@gapi/cli-builder';
import { Container, Module } from '@gapi/core';

import { Docker, DockerCompose, Git, MakeDir, Npm } from './runners';
import { NginxController } from './runners/nginx/nginx.controller';
import {
  NginxConfigPayload,
  NginxService,
} from './runners/nginx/nginx.service';

export enum Commands {
  GIT = 1,
  NPM = 2,
  DOCKER = 3,
  DOCKER_COMPOSE = 4,
  MKDIR = 5,
  CHMOD = 6,
  NGINX_RESTART = 7,
  NGINX_GENERATE_CONFIG = 8,
  NGINX_SAVE_CONFIG = 9,
  NGINX_REMOVE_CONFIG = 10,
}

interface NginxSaveConfig extends NginxConfigPayload {
  path: string;
}

@Module({
  imports: [
    CLIBuilder.forRoot<typeof Commands, Promise<unknown>>(
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
        NGINX_GENERATE_CONFIG: async (args: NginxConfigPayload) => {
          const nginxService = Container.get(NginxService);
          console.log(
            '[NGINX_GENERATE_CONFIG]: started arguments: ',
            args,
          );
          const data = nginxService.generateConfig(args);
          console.log('[NGINX_GENERATE_CONFIG]: exited');
          return {
            code: 200,
            data,
          };
        },
        NGINX_RESTART: async (args: { name: string }) => {
          const nginxService = Container.get(NginxService);

          console.log('[NGINX_RESTART]: started arguments: ', args);
          let error;
          try {
            await nginxService.restartNginx(args.name);
          } catch (e) {
            error = e;
            console.error(e);
            return {
              code: 1,
              data: null,
              error,
            };
          }
          console.log('[NGINX_RESTART]: exited');
          return {
            code: 0,
            data: true,
          };
        },
        NGINX_SAVE_CONFIG: async (args: NginxSaveConfig) => {
          const nginxService = Container.get(NginxService);
          console.log(
            '[NGINX_SAVE_CONFIG]: started arguments: ',
            args,
          );
          const data = await nginxService.saveConfiguration(
            args.path,
            args,
          );
          console.log('[NGINX_SAVE_CONFIG]: exited');
          return {
            code: 200,
            data,
          };
        },
        NGINX_REMOVE_CONFIG: async (args: NginxSaveConfig) => {
          const nginxService = Container.get(NginxService);
          console.log(
            '[NGINX_REMOVE_CONFIG]: started arguments: ',
            args,
          );
          const data = await nginxService.removeConfiguration(
            args.path,
            args.subDomain,
          );
          console.log('[NGINX_REMOVE_CONFIG]: exited');
          return {
            code: 200,
            data,
          };
        },
      },
      Commands,
    ),
  ],
  controllers: [NginxController],
})
class AppModule {}

Bootstrap(AppModule).subscribe(() => {
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

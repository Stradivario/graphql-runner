/* eslint-disable @typescript-eslint/no-explicit-any */

import { Docker, DockerCompose, Git, Npm } from './runners';

export enum Commands {
  GIT = 1,
  NPM = 2,
  DOCKER = 3,
  DOCKER_COMPOSE = 4,
}

type GenericEnumType<T, K, A> = {
  [key in keyof T]: (args: A) => K;
};

type GenericEnum<T, K> = GenericEnumType<
  typeof Commands,
  Promise<T>,
  K
>;

export const CommandsToExecute: GenericEnum<any, any> = {
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
  DOCKER_COMPOSE: async (args: string[]) => {
    console.log('[RUN_DOCKER_COMPOSE]: started arguments: ', args);
    const data = await DockerCompose(args);
    console.log('[RUN_DOCKER_COMPOSE]: exited');
    return data;
  },
};

export const getAction = <T = {}, K = {}>(
  cmd: string | number,
): ((args: K, cwd?: string) => Promise<T>) =>
  CommandsToExecute[Commands[cmd]];

export const executeAction = <T = {}, K = {}>(
  action: string | number,
) => getAction<T, K>(action);

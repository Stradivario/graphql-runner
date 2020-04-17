/* eslint-disable @typescript-eslint/no-var-requires */
import {
  Injectable,
  subscribeToTopic,
  WebSocketLink,
} from '@gapi/core';
import { gql } from 'apollo-server-core';
import { createHash } from 'crypto';
import { networkInterfaces } from 'os';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { SubscriptionClient } from 'subscriptions-transport-ws';

import { Environment } from '../../app.constants';
import { Commands, executeAction } from '../executors/commands';
import { ISubscription } from '../introspection/graphql-server';

const webSocketImpl = require('ws');

const machineHash = createHash('md5')
  .update(JSON.stringify(networkInterfaces()))
  .digest('base64');
export enum Workers {
  vscode = 1,
  runner = 2,
}
@Injectable({
  init: true,
})
export class SubscriptionService {
  subscription: Subscription;
  currentSubscriptionUri: string;
  private link: WebSocketLink;
  constructor() {
    if (Environment.SUBSCRIPTION_URI) {
      this.subscribe(
        Environment.SUBSCRIPTION_URI,
        Environment.SECRET_KEY,
      );
    }
  }
  subscribe(uri: string, authorization?: string) {
    this.currentSubscriptionUri = uri;
    this.link = new WebSocketLink({
      uri,
      options: {
        connectionParams: {
          authorization,
          machineHash,
          worker_type: Workers[Workers.runner],
          networkInterfaces: JSON.stringify(networkInterfaces()),
        },
        reconnect: true,
      },
      webSocketImpl,
    });
    this.subscription = subscribeToTopic<{
      data: ISubscription;
    }>(
      gql`
        subscription($machineHash: String!) {
          registerWorker(machineHash: $machineHash) {
            command
            args
            cwd
          }
        }
      `,
      {
        machineHash,
      },
      this.link,
    )
      .pipe(map(({ data }) => data.registerWorker))
      .subscribe(async ({ args, command, cwd }) => {
        const cmd = Commands[command];
        if (!cmd) {
          throw new Error('Missing command');
        }
        await executeAction(command)(JSON.parse(args), cwd);
      }, console.error);
    return this.subscription;
  }

  unsubscribe() {
    if (this.link) {
      const subscriptionClient = this.link[
        'subscriptionClient'
      ] as SubscriptionClient;
      subscriptionClient.close();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

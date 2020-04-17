/* eslint-disable @typescript-eslint/no-var-requires */
import {
  Controller,
  GraphQLControllerOptions,
  GraphqlEnumType,
  Mutation,
} from '@gapi/core';
import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';

import { GenericCommandType } from './app.types';
import { Commands, executeAction } from './core/executors';
import { SubscriptionService } from './core/services/subscription.service';

@Controller<GraphQLControllerOptions>({
  guards: [],
  type: GenericCommandType,
})
export class AppController {
  stoppedListener: NodeJS.Timeout;

  constructor(private subscriptionService: SubscriptionService) {}

  @Mutation({
    uri: {
      type: GraphQLNonNull(GraphQLString),
    },
  })
  subscribeToGraphqlPubsub(root, { uri }) {
    this.subscriptionService.unsubscribe();
    this.subscriptionService.subscribe(uri);
    return {
      data: `Success subscribed to pubsub ${uri}`,
    };
  }

  @Mutation()
  unsubscribeToGraphqlPubsub() {
    this.subscriptionService.unsubscribe();
    return {
      data: `Success unsubscribed from ${this.subscriptionService.currentSubscriptionUri}`,
    };
  }

  @Mutation({
    cmd: {
      type: new GraphQLNonNull(
        new GraphqlEnumType({
          name: 'Commands',
          values: Commands,
        }),
      ),
    },
    args: {
      type: new GraphQLList(GraphQLString),
    },
    cwd: {
      type: GraphQLString,
    },
  })
  async execute(
    root,
    { cmd, args, cwd }: { cmd: string; args: string[]; cwd: string },
  ) {
    return executeAction<number, string[]>(cmd)(args, cwd);
  }
}

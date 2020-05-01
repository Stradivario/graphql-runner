import {
  Controller,
  GraphQLControllerOptions,
  Mutation,
} from '@gapi/core';
import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { NginxConfigPayload, NginxService } from './nginx.service';

export const NginxType = new GraphQLObjectType({
  name: 'NginxType',
  fields: {
    config: {
      type: GraphQLString,
    },
  },
});

const NginxPayload = new GraphQLInputObjectType({
  name: 'NginxPayload',
  fields: () => ({
    domain: {
      type: GraphQLString,
    },
    subDomain: {
      type: GraphQLString,
    },
    ip: {
      type: GraphQLString,
    },
  }),
});

@Controller<GraphQLControllerOptions>({
  guards: [],
  type: NginxType,
})
export class NginxController {
  constructor(private nginxService: NginxService) {}
  @Mutation({
    payload: {
      type: new GraphQLNonNull(NginxPayload),
    },
  })
  simulateNginxConfigGeneration(
    root,
    { payload }: { payload: NginxConfigPayload },
  ) {
    return {
      config: this.nginxService.generateConfig(payload),
    };
  }

  @Mutation({
    path: {
      type: new GraphQLNonNull(GraphQLString),
    },
    payload: {
      type: new GraphQLNonNull(NginxPayload),
    },
  })
  async saveNginxConfiguration(
    root,
    { path, payload }: { path: string; payload: NginxConfigPayload },
  ) {
    return {
      config: await this.nginxService.saveConfiguration(
        path,
        payload,
      ),
    };
  }

  @Mutation({
    path: {
      type: GraphQLString,
    },
    payload: {
      type: new GraphQLNonNull(NginxPayload),
    },
  })
  async removeNginxConfiguration(
    root,
    { path, payload }: { path: string; payload: NginxConfigPayload },
  ) {
    return {
      config: await this.nginxService.removeConfiguration(
        path,
        payload.subDomain,
      ),
    };
  }
}

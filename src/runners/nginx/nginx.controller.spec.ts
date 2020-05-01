import 'jest';

import {
  Container,
  createTestBed,
  GraphQLModule,
  HAPI_SERVER,
  HapiModule,
  sendRequest,
  setConfigGraphql,
  setConfigServer,
} from '@gapi/core';
import { exists, readFile, unlink } from 'fs';
import { Server } from 'hapi';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { promisify } from 'util';

import { NginxController } from './nginx.controller';
import { NginxService } from './nginx.service';

describe('Nginx Controller', () => {
  beforeAll(async () => {
    await createTestBed(
      {
        providers: [NginxService],
        controllers: [NginxController],
      },
      [
        HapiModule.forRoot(setConfigServer()),
        GraphQLModule.forRoot(setConfigGraphql()),
      ],
    ).toPromise();
  });

  afterAll(
    async () => await Container.get<Server>(HAPI_SERVER).stop(),
  );

  it('e2e: queries => (simulateNginxConfigGeneration) : Should sucessfully ....', async (done) => {
    from(
      sendRequest<{
        simulateNginxConfigGeneration: { config: string };
      }>({
        query: `
          mutation simulateNginxConfigGeneration($payload: NginxPayload!) {
            simulateNginxConfigGeneration(payload: $payload) {
              config
            }
          }
        `,
        variables: {
          payload: {
            ip: '123',
            domain: '123',
            subDomain: '123',
          },
        },
        signiture: {
          token: '',
        },
      }),
    )
      .pipe(
        map((res) => {
          expect(res.success).toBeTruthy();
          return res.data.simulateNginxConfigGeneration;
        }),
      )
      .subscribe(
        async (res) => {
          expect(res.config).toBeTruthy();
          expect(
            res.config.includes('server_name 123.123'),
          ).toBeTruthy();
          expect(
            res.config.includes('access_log 123.access.log'),
          ).toBeTruthy();
          expect(
            res.config.includes('proxy_pass http://123'),
          ).toBeTruthy();
          done();
        },
        (err) => {
          console.error(err);
          expect(err).toBe(null);
          done();
        },
      );
  });

  it('e2e: queries => (saveNginxConfiguration) : Should sucessfully ....', async (done) => {
    from(
      sendRequest<{
        saveNginxConfiguration: { config: string };
      }>({
        query: `
          mutation saveNginxConfiguration($path: String!, $payload: NginxPayload!) {
            saveNginxConfiguration(path: $path, payload: $payload) {
              config
            }
          }
        `,
        variables: {
          path: './src/runners/nginx',
          payload: {
            ip: '123',
            domain: '123',
            subDomain: '123',
          },
        },
        signiture: {
          token: '',
        },
      }),
    )
      .pipe(
        map((res) => {
          expect(res.success).toBeTruthy();
          return res.data.saveNginxConfiguration;
        }),
      )
      .subscribe(
        async (data) => {
          expect(data.config).toBeTruthy();
          const res = await promisify(readFile)(
            './src/runners/nginx/123.conf',
            {
              encoding: 'utf-8',
            },
          );
          expect(res).toBe(data.config);
          expect(
            await promisify(exists)('./src/runners/nginx/123.conf'),
          ).toBeTruthy();
          await promisify(unlink)('./src/runners/nginx/123.conf');
          expect(
            await promisify(exists)('./src/runners/nginx/123.conf'),
          ).toBeFalsy();
          done();
        },
        (err) => {
          console.error(err);
          expect(err).toBe(null);
          done();
        },
      );
  });

  it('e2e: queries => (removeNginxConfiguration) : Should sucessfully ....', async (done) => {
    await Container.get(
      NginxService,
    ).saveConfiguration('./src/runners/nginx', { subDomain: '123' });
    from(
      sendRequest<{
        removeNginxConfiguration: { config: string };
      }>({
        query: `
          mutation removeNginxConfiguration($path: String!, $payload: NginxPayload!) {
            removeNginxConfiguration(path: $path, payload: $payload) {
              config
            }
          }
        `,
        variables: {
          path: './src/runners/nginx',
          payload: {
            subDomain: '123',
          },
        },
        signiture: {
          token: '',
        },
      }),
    )
      .pipe(
        map((res) => {
          expect(res.success).toBeTruthy();
          return res.data.removeNginxConfiguration;
        }),
      )
      .subscribe(
        async (data) => {
          expect(data.config).toBeFalsy();
          const res = await promisify(exists)(
            './src/runners/nginx/123.conf',
          );
          expect(res).toBeFalsy();
          done();
        },
        (err) => {
          console.error(err);
          expect(err).toBe(null);
          done();
        },
      );
  });
});

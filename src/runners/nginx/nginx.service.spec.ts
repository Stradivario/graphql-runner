import 'jest';

import { Container, createTestBed } from '@gapi/core';
import { readFile } from 'fs';
import { promisify } from 'util';

import { NginxService } from './nginx.service';

describe('[NginxService]: tests', () => {
  let nginxService: NginxService;

  beforeAll(async () => {
    await createTestBed(
      {
        providers: [NginxService],
      },
      [],
    ).toPromise();
    nginxService = Container.get(NginxService);
    expect(nginxService).toBeTruthy();
  });
  it('Should generate correct nginx configuration', async () => {
    const mockConfig = {
      domain: 'graphql-server.com',
      ip: '127.0.0.1',
      subDomain: 'mamamikazadasiigraqsteb',
    };
    const config = nginxService.generateConfig(mockConfig);
    expect(
      config.includes(`proxy_pass http://${mockConfig.ip}`),
    ).toBeTruthy();
    expect(
      config.includes(
        `server_name ${mockConfig.subDomain}.${mockConfig.domain};`,
      ),
    ).toBeTruthy();
    expect(
      config.includes(
        `access_log ${mockConfig.subDomain}.access.log;`,
      ),
    ).toBeTruthy();
    expect(
      config.includes(
        'ssl_certificate /usr/share/certs/fullchain.pem;',
      ),
    ).toBeTruthy();

    expect(
      config.includes(
        'ssl_certificate_key /usr/share/certs/privkey.pem',
      ),
    ).toBeTruthy();
  });

  it('Should save configuration to appropriate folder', async () => {
    const mockConfig = {
      domain: 'graphql-server.com',
      ip: '127.0.0.1',
      subDomain: 'mamamikazadasiigraqsteb',
    };
    const folderToSave = './src/runners/nginx';
    await nginxService.saveConfiguration(folderToSave, mockConfig);
    const file = await promisify(readFile)(
      `${folderToSave}/${mockConfig.subDomain}.conf`,
      {
        encoding: 'utf-8',
      },
    );
    expect(file).toBeTruthy();
    expect(
      file.includes(`proxy_pass http://${mockConfig.ip}`),
    ).toBeTruthy();
    expect(
      file.includes(
        `server_name ${mockConfig.subDomain}.${mockConfig.domain};`,
      ),
    ).toBeTruthy();
    expect(
      file.includes(`access_log ${mockConfig.subDomain}.access.log;`),
    ).toBeTruthy();
    await nginxService.removeConfiguration(
      folderToSave,
      mockConfig.subDomain,
    );
  });
});

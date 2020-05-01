import { Injectable } from '@gapi/core';
import { exec } from 'child_process';
import { unlink, writeFile } from 'fs';
import { promisify } from 'util';

export const defaultDomain = 'graphql-server.com';

export interface NginxConfigPayload {
  subDomain: string;
  domain: string;
  ip: string;
}

@Injectable()
export class NginxService {
  async saveConfiguration(
    path: string,
    payload: Partial<NginxConfigPayload>,
  ) {
    const config = this.generateConfig({
      domain: payload.domain,
      ip: payload.ip,
      subDomain: payload.subDomain,
    });
    await promisify(writeFile)(
      `${path}/${payload.subDomain}.conf`,
      config,
      {
        encoding: 'utf-8',
      },
    );
    return config;
  }

  async restartNginx(name = 'gapi-api-nginx') {
    await promisify(exec)(`docker exec ${name} nginx -s reload`);
  }

  async removeConfiguration(path: string, subDomain: string) {
    await promisify(unlink)(`${path}/${subDomain}.conf`);
  }

  generateConfig({ domain, ip, subDomain }: NginxConfigPayload) {
    return `server {
  listen 80;
  gzip on;
  server_name ${subDomain}.${domain};
  access_log ${subDomain}.access.log;
  location / {
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_http_version 1.1;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $host;
    proxy_pass http://${ip};
    proxy_request_buffering off;
    proxy_buffering off;
  }
  location ^~ /.well-known/acme-challenge {
    allow all;
    root /var/www/acme_challenge_webroot;
    default_type text/plain;
  }
  if ($scheme = http) {
    return 301 https://$server_name$request_uri;
  }
  listen 443;
  ssl on;
  ssl_prefer_server_ciphers on;
  ssl_ciphers "EECDH+ECDSA+AESGCM:EECDH+aRSA+AESGCM:EECDH+ECDSA+SHA384:EECDH+ECDSA+SHA256:EECDH+aRSA+SHA384:EECDH+aRSA+SHA256:EECDH:DHE+AESGCM:DHE:!RSA!aNULL:!eNULL:!LOW:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS:!CAMELLIA:!SEED";

  # RSA certificates
  ssl_certificate /usr/share/certs/fullchain.pem;
  ssl_certificate_key /usr/share/certs/privkey.pem;
}
      
      `;
  }
}

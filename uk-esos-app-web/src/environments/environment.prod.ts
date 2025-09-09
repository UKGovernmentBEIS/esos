// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { KeycloakOptions } from 'keycloak-angular';
import { KeycloakConfig, KeycloakInitOptions } from 'keycloak-js';

// Add here your keycloak setup infos
const keycloakConfig: KeycloakConfig = {
  url: '/auth',
  realm: 'uk-esos',
  clientId: 'uk-esos-web-app',
};

const keycloakInitOptions: KeycloakInitOptions = {
  onLoad: 'check-sso',
  enableLogging: true,
  pkceMethod: 'S256',
  responseMode: 'query',
};

const keycloakOptions: KeycloakOptions = {
  config: keycloakConfig,
  initOptions: keycloakInitOptions,
  enableBearerInterceptor: true,
  loadUserProfileAtStartUp: true,
  bearerExcludedUrls: [],
  shouldAddToken: ({ url }) => !url.includes('api.pwnedpasswords.com'),
};

const apiOptions = {
  baseUrl: '/api',
};

const timeoutBanner = {
  timeOffsetSeconds: 30,
};

export const environment = {
  production: true,
  keycloakOptions,
  apiOptions,
  timeoutBanner,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

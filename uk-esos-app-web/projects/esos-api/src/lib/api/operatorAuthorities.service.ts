/**
 * ESOS API Documentation
 * ESOS API Documentation
 *
 * The version of the OpenAPI document: uk-esos-app-api 0.81.0-SNAPSHOT
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { HttpClient, HttpEvent, HttpHeaders, HttpParameterCodec, HttpParams, HttpResponse } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';

import { Observable } from 'rxjs';

import { Configuration } from '../configuration';
import { CustomHttpParameterCodec } from '../encoder';
import { AccountOperatorAuthorityUpdateWrapperDTO } from '../model/accountOperatorAuthorityUpdateWrapperDTO';
import { AccountOperatorsUsersAuthoritiesInfoDTO } from '../model/accountOperatorsUsersAuthoritiesInfoDTO';
import { BASE_PATH } from '../variables';

@Injectable({
  providedIn: 'root',
})
export class OperatorAuthoritiesService {
  protected basePath = 'http://localhost:8080/api';
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();
  public encoder: HttpParameterCodec;

  constructor(
    protected httpClient: HttpClient,
    @Optional() @Inject(BASE_PATH) basePath: string,
    @Optional() configuration: Configuration,
  ) {
    if (configuration) {
      this.configuration = configuration;
    }
    if (typeof this.configuration.basePath !== 'string') {
      if (typeof basePath !== 'string') {
        basePath = this.basePath;
      }
      this.configuration.basePath = basePath;
    }
    this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
  }

  private addToHttpParams(httpParams: HttpParams, value: any, key?: string): HttpParams {
    if (typeof value === 'object' && value instanceof Date === false) {
      httpParams = this.addToHttpParamsRecursive(httpParams, value);
    } else {
      httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
    }
    return httpParams;
  }

  private addToHttpParamsRecursive(httpParams: HttpParams, value?: any, key?: string): HttpParams {
    if (value == null) {
      return httpParams;
    }

    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        (value as any[]).forEach((elem) => (httpParams = this.addToHttpParamsRecursive(httpParams, elem, key)));
      } else if (value instanceof Date) {
        if (key != null) {
          httpParams = httpParams.append(key, (value as Date).toISOString().substr(0, 10));
        } else {
          throw Error('key may not be null if value is Date');
        }
      } else {
        Object.keys(value).forEach(
          (k) => (httpParams = this.addToHttpParamsRecursive(httpParams, value[k], key != null ? `${key}.${k}` : k)),
        );
      }
    } else if (key != null) {
      httpParams = httpParams.append(key, value);
    } else {
      throw Error('key may not be null if value is not object or array');
    }
    return httpParams;
  }

  /**
   * Deletes authority from the account
   * @param accountId The account id
   * @param userId The user id
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public deleteAccountOperatorAuthority(accountId: number, userId: string): Observable<any>;
  public deleteAccountOperatorAuthority(
    accountId: number,
    userId: string,
    observe: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<HttpResponse<any>>;
  public deleteAccountOperatorAuthority(
    accountId: number,
    userId: string,
    observe: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<HttpEvent<any>>;
  public deleteAccountOperatorAuthority(
    accountId: number,
    userId: string,
    observe: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<any>;
  public deleteAccountOperatorAuthority(
    accountId: number,
    userId: string,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<any> {
    if (accountId === null || accountId === undefined) {
      throw new Error(
        'Required parameter accountId was null or undefined when calling deleteAccountOperatorAuthority.',
      );
    }
    if (userId === null || userId === undefined) {
      throw new Error('Required parameter userId was null or undefined when calling deleteAccountOperatorAuthority.');
    }

    let headers = this.defaultHeaders;

    // authentication (bearerAuth) required
    const credential = this.configuration.lookupCredential('bearerAuth');
    if (credential) {
      headers = headers.set('Authorization', 'Bearer ' + credential);
    }

    let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (httpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/json'];
      httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    }
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    let responseType_: 'text' | 'json' = 'json';
    if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
      responseType_ = 'text';
    }

    return this.httpClient.delete<any>(
      `${this.configuration.basePath}/v1.0/operator-authorities/account/${encodeURIComponent(
        String(accountId),
      )}/${encodeURIComponent(String(userId))}`,
      {
        responseType: <any>responseType_,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      },
    );
  }

  /**
   * Deletes logged in authority from the account
   * @param accountId The account id
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public deleteCurrentUserAccountOperatorAuthority(accountId: number): Observable<any>;
  public deleteCurrentUserAccountOperatorAuthority(
    accountId: number,
    observe: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<HttpResponse<any>>;
  public deleteCurrentUserAccountOperatorAuthority(
    accountId: number,
    observe: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<HttpEvent<any>>;
  public deleteCurrentUserAccountOperatorAuthority(
    accountId: number,
    observe: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<any>;
  public deleteCurrentUserAccountOperatorAuthority(
    accountId: number,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<any> {
    if (accountId === null || accountId === undefined) {
      throw new Error(
        'Required parameter accountId was null or undefined when calling deleteCurrentUserAccountOperatorAuthority.',
      );
    }

    let headers = this.defaultHeaders;

    // authentication (bearerAuth) required
    const credential = this.configuration.lookupCredential('bearerAuth');
    if (credential) {
      headers = headers.set('Authorization', 'Bearer ' + credential);
    }

    let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (httpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/json'];
      httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    }
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    let responseType_: 'text' | 'json' = 'json';
    if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
      responseType_ = 'text';
    }

    return this.httpClient.delete<any>(
      `${this.configuration.basePath}/v1.0/operator-authorities/account/${encodeURIComponent(String(accountId))}`,
      {
        responseType: <any>responseType_,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      },
    );
  }

  /**
   * Retrieves the authorities of type OPERATOR for the given account id along with the account contact types
   * @param accountId The account id
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getAccountOperatorAuthorities(accountId: number): Observable<AccountOperatorsUsersAuthoritiesInfoDTO>;
  public getAccountOperatorAuthorities(
    accountId: number,
    observe: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<HttpResponse<AccountOperatorsUsersAuthoritiesInfoDTO>>;
  public getAccountOperatorAuthorities(
    accountId: number,
    observe: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<HttpEvent<AccountOperatorsUsersAuthoritiesInfoDTO>>;
  public getAccountOperatorAuthorities(
    accountId: number,
    observe: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<AccountOperatorsUsersAuthoritiesInfoDTO>;
  public getAccountOperatorAuthorities(
    accountId: number,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<any> {
    if (accountId === null || accountId === undefined) {
      throw new Error('Required parameter accountId was null or undefined when calling getAccountOperatorAuthorities.');
    }

    let headers = this.defaultHeaders;

    // authentication (bearerAuth) required
    const credential = this.configuration.lookupCredential('bearerAuth');
    if (credential) {
      headers = headers.set('Authorization', 'Bearer ' + credential);
    }

    let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (httpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/json'];
      httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    }
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    let responseType_: 'text' | 'json' = 'json';
    if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
      responseType_ = 'text';
    }

    return this.httpClient.get<AccountOperatorsUsersAuthoritiesInfoDTO>(
      `${this.configuration.basePath}/v1.0/operator-authorities/account/${encodeURIComponent(String(accountId))}`,
      {
        responseType: <any>responseType_,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      },
    );
  }

  /**
   * Updates authorities for users of type OPERATOR for the given account id
   * @param accountId The account id
   * @param accountOperatorAuthorityUpdateWrapperDTO
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public updateAccountOperatorAuthorities(
    accountId: number,
    accountOperatorAuthorityUpdateWrapperDTO: AccountOperatorAuthorityUpdateWrapperDTO,
  ): Observable<any>;
  public updateAccountOperatorAuthorities(
    accountId: number,
    accountOperatorAuthorityUpdateWrapperDTO: AccountOperatorAuthorityUpdateWrapperDTO,
    observe: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<HttpResponse<any>>;
  public updateAccountOperatorAuthorities(
    accountId: number,
    accountOperatorAuthorityUpdateWrapperDTO: AccountOperatorAuthorityUpdateWrapperDTO,
    observe: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<HttpEvent<any>>;
  public updateAccountOperatorAuthorities(
    accountId: number,
    accountOperatorAuthorityUpdateWrapperDTO: AccountOperatorAuthorityUpdateWrapperDTO,
    observe: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<any>;
  public updateAccountOperatorAuthorities(
    accountId: number,
    accountOperatorAuthorityUpdateWrapperDTO: AccountOperatorAuthorityUpdateWrapperDTO,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<any> {
    if (accountId === null || accountId === undefined) {
      throw new Error(
        'Required parameter accountId was null or undefined when calling updateAccountOperatorAuthorities.',
      );
    }
    if (accountOperatorAuthorityUpdateWrapperDTO === null || accountOperatorAuthorityUpdateWrapperDTO === undefined) {
      throw new Error(
        'Required parameter accountOperatorAuthorityUpdateWrapperDTO was null or undefined when calling updateAccountOperatorAuthorities.',
      );
    }

    let headers = this.defaultHeaders;

    // authentication (bearerAuth) required
    const credential = this.configuration.lookupCredential('bearerAuth');
    if (credential) {
      headers = headers.set('Authorization', 'Bearer ' + credential);
    }

    let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (httpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/json'];
      httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    }
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/json'];
    const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected !== undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    let responseType_: 'text' | 'json' = 'json';
    if (httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
      responseType_ = 'text';
    }

    return this.httpClient.post<any>(
      `${this.configuration.basePath}/v1.0/operator-authorities/account/${encodeURIComponent(String(accountId))}`,
      accountOperatorAuthorityUpdateWrapperDTO,
      {
        responseType: <any>responseType_,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      },
    );
  }
}

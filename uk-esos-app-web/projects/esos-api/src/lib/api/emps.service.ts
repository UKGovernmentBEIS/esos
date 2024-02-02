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
import { FileToken } from '../model/fileToken';
import { BASE_PATH } from '../variables';

@Injectable({
  providedIn: 'root',
})
export class EmpsService {
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
   * Generate the token to get the file that belongs to the provided emp id
   * @param id The emp id
   * @param uuid The attachment uuid
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public generateGetEmpAttachmentToken(id: string, uuid: string): Observable<FileToken>;
  public generateGetEmpAttachmentToken(
    id: string,
    uuid: string,
    observe: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<HttpResponse<FileToken>>;
  public generateGetEmpAttachmentToken(
    id: string,
    uuid: string,
    observe: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<HttpEvent<FileToken>>;
  public generateGetEmpAttachmentToken(
    id: string,
    uuid: string,
    observe: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<FileToken>;
  public generateGetEmpAttachmentToken(
    id: string,
    uuid: string,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling generateGetEmpAttachmentToken.');
    }
    if (uuid === null || uuid === undefined) {
      throw new Error('Required parameter uuid was null or undefined when calling generateGetEmpAttachmentToken.');
    }

    let queryParameters = new HttpParams({ encoder: this.encoder });
    if (uuid !== undefined && uuid !== null) {
      queryParameters = this.addToHttpParams(queryParameters, <any>uuid, 'uuid');
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

    return this.httpClient.get<FileToken>(
      `${this.configuration.basePath}/v1.0/emps/${encodeURIComponent(String(id))}/attachments`,
      {
        params: queryParameters,
        responseType: <any>responseType_,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      },
    );
  }

  /**
   * Generate the token to get the document that belongs to the provided emp id
   * @param id The emp id
   * @param uuid The document uuid
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public generateGetEmpDocumentToken(id: string, uuid: string): Observable<FileToken>;
  public generateGetEmpDocumentToken(
    id: string,
    uuid: string,
    observe: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<HttpResponse<FileToken>>;
  public generateGetEmpDocumentToken(
    id: string,
    uuid: string,
    observe: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<HttpEvent<FileToken>>;
  public generateGetEmpDocumentToken(
    id: string,
    uuid: string,
    observe: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<FileToken>;
  public generateGetEmpDocumentToken(
    id: string,
    uuid: string,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json' },
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling generateGetEmpDocumentToken.');
    }
    if (uuid === null || uuid === undefined) {
      throw new Error('Required parameter uuid was null or undefined when calling generateGetEmpDocumentToken.');
    }

    let queryParameters = new HttpParams({ encoder: this.encoder });
    if (uuid !== undefined && uuid !== null) {
      queryParameters = this.addToHttpParams(queryParameters, <any>uuid, 'uuid');
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

    return this.httpClient.get<FileToken>(
      `${this.configuration.basePath}/v1.0/emps/${encodeURIComponent(String(id))}/document`,
      {
        params: queryParameters,
        responseType: <any>responseType_,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      },
    );
  }
}

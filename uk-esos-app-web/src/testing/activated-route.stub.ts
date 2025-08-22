import { convertToParamMap, ParamMap, Params, UrlSegment } from '@angular/router';

import { ReplaySubject } from 'rxjs';

import { ActivatedRouteSnapshotStub } from './activated-route-snapshot.stub';

/**
 * An ActivateRoute test double with a `paramMap` observable.
 * Use the `setParamMap()` method to add the next `paramMap` value.
 */
export class ActivatedRouteStub {
  // Use a ReplaySubject to share previous values with subscribers
  // and pump new values into the `paramMap` observable
  readonly snapshot: ActivatedRouteSnapshotStub;
  private paramSubject = new ReplaySubject<ParamMap>(1);
  readonly paramMap = this.paramSubject.asObservable();
  private queryParamSubject = new ReplaySubject<ParamMap>(1);
  readonly queryParamMap = this.queryParamSubject.asObservable();
  private dataSubject = new ReplaySubject<Params>(1);
  readonly data = this.dataSubject.asObservable();
  private fragmentSubject = new ReplaySubject<string>(1);
  readonly fragment = this.fragmentSubject.asObservable();
  private urlSubject = new ReplaySubject<UrlSegment[]>(1);
  readonly url = this.urlSubject.asObservable();
  private titleSubject = new ReplaySubject<string>(1);
  readonly title = this.titleSubject.asObservable();

  constructor(
    initialParams?: Params,
    initialQueryParams?: Params,
    resolves: Params = {},
    fragment?: string,
    url?: UrlSegment[],
    title?: string,
  ) {
    this.snapshot = new ActivatedRouteSnapshotStub(initialParams, initialQueryParams, resolves, title);
    this.setParamMap(initialParams);
    this.setQueryParamMap(initialQueryParams);
    this.setResolveMap(resolves);
    this.setFragment(fragment);
    this.setUrl(url);
    this.setTitle(title);
  }

  get firstChild(): ActivatedRouteStub | null {
    return undefined;
  }

  /** Set the paramMap observables's next value */
  setParamMap(params?: Params): void {
    const newParams = convertToParamMap(params);
    this.paramSubject.next(newParams);
    this.snapshot.paramMap = newParams;
  }

  /** Set the queryParamMap observable's next value */
  setQueryParamMap(params?: Params): void {
    this.queryParamSubject.next(convertToParamMap(params));
  }

  /** Set the data for resolves */
  setResolveMap(params?: Params): void {
    this.dataSubject.next(params);
  }

  /** Set the fragment */
  setFragment(fragment?: string): void {
    this.fragmentSubject.next(fragment);
  }

  setUrl(url?: UrlSegment[]): void {
    this.urlSubject.next(url);
  }

  setTitle(title?: string): void {
    this.titleSubject.next(title);
  }
}

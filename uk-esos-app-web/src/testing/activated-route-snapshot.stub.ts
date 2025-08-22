import { ActivatedRouteSnapshot, convertToParamMap, Data, ParamMap, Params, Route, UrlSegment } from '@angular/router';

/**
 * An ActivateRoute test double with a `paramMap` observable.
 * Use the `setParamMap()` method to add the next `paramMap` value.
 */
export class ActivatedRouteSnapshotStub implements ActivatedRouteSnapshot {
  // Use a ReplaySubject to share previous values with subscribers
  // and pump new values into the `paramMap` observable
  paramMap: ParamMap;
  readonly queryParamMap: ParamMap;
  readonly data: Data;
  component: any | string | null;
  fragment: string;
  outlet: string;
  params: Params;
  queryParams: Params;
  readonly routeConfig: Route | null;
  title: string;

  constructor(initialParams?: Params, initialQueryParams?: Params, resolves?: Data, title?: string) {
    this.paramMap = convertToParamMap(initialParams);
    this.queryParamMap = convertToParamMap(initialQueryParams);
    this.data = resolves;
    this.title = title ?? '';
  }

  get children(): ActivatedRouteSnapshot[] {
    return [];
  }

  get firstChild(): ActivatedRouteSnapshot | null {
    return undefined;
  }

  get parent(): ActivatedRouteSnapshot | null {
    return undefined;
  }

  get pathFromRoot(): ActivatedRouteSnapshot[] {
    return [];
  }

  get root(): ActivatedRouteSnapshot {
    return undefined;
  }

  get url(): UrlSegment[] {
    return undefined;
  }
}

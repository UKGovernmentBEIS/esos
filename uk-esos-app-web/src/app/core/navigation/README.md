# NAVIGATION

## General

According to current specs, breadcrumbs should be used everywhere inside the app except for wizard steps.  
To navigate inside wizards user should use the `< Back` links provided.  
Keep in mind that breadcrumbs **ARE VISIBLE** inside wizards, however, their structure is not modified i.e. the last breadcrumb link is always the task/page that triggered the wizard.  
**The only exception to the above is when we have subtasks with task lists that themselves contain wizards (e.g Permit -> Monitoring approaches).**  
Summary pages **MUST** provide breadcrumbs (e.g. `Dashboard > Apply for an EMP > Monitoring approach`) as they are not part of the wizard.  
`< Back` links **SHOULD NOT BE PRESENT** in the first step of a wizard (pointless) or in the summary/confirmation page.

## Breadcrumbs

Breadcrumbs can only be defined on routes data property and play upon route hierarchy.  
Breadcrumb assembly will start from the top of the route hierarchy all the way to the bottom creating a respective breadcrumb hierarchy.  
All routes with breadcrumbs must provide a `data: { breadcrumb: ... }` property  
**_Example:_**

```typescript
export const ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { breadcrumb: 'Home' },
    children: [
      {
        path: 'heroes',
        component: HeroListComponent,
        data: { breadcrumb: 'Heroes' },
      },
      {
        path: 'about',
        component: AboutComponent,
        data: { breadcrumb: 'About' },
      },
    ],
  },
];
```

The `breadcrumb` property can be one of the following:

- `string`: This is for when the route's breadcrumb is a static string e.g.

```typescript
const route = {
  path: 'heroes',
  component: HeroesListComponent,
  data: { breadcrumb: 'Heroes' },
};
```

- `boolean`: When `true` the route's breadcrumb will be the same as the route's `title` property. When `false`
  the breadcrumbs **will not show at all** on the page e.g.

```typescript
const route = {
  path: 'heroes',
  component: HeroesListComponent,
  title: 'Heroes',
  data: { breadcrumb: true },
};
```

- `function`: The function must be of the form `(data: Data) => string` where `data` is the route's data. This is
  commonly used together with a [ResolveFn](https://angular.io/api/router/ResolveFn) that can populate the route's
  data with relevant information. You can then extract the info you need from the `Data` object to get the
  breadcrumb _e.g._

```typescript
const resolveRequestTaskBreadcrumb = ({ taskType }: Data) => {
  switch (taskType) {
    case 'EMP_ISSUANCE_UKETS_APPLICATION_SUBMIT':
      return 'Apply for an EMP';
    case 'EMP_ISSUANCE_UKETS_APPLICATION_REVIEW':
      return 'Review EMP application';
    case 'EMP_ISSUANCE_UKETS_WAIT_FOR_REVIEW':
      return 'Wait for EMP review';
    default:
      return null;
  }
};

const resolveTaskType: ResolveFn = () => inject(RequestTaskStore).pipe(requestTaskQuery.selectRequestTaskType);

const route = {
  path: ':taskId',
  data: { breadcrumb: resolveRequestTaskBreadcrumb },
  resolve: { taskType: resolveTaskType },
};
```

- `object`: The object must satisfy the following interface:

```typescript
import { Data } from '@angular/router';

{
  resolveText: (data: Data) => string;
  skipLink: boolean;
}
```

`resolveText` is a function that resolves the breadcrumb's text (exactly as in previous bullet).  
`skipLink` is a flag that determines whether the breadcrumb should use this route's path (**false**) as link or
use the path of the first child route that has a component (**true**). It may also be a function of the form `(data: Data) => boolean`.  
This is useful when routes are structured in weird ways.

> **NOTE**: In the unlikely event that you need custom breadcrumb management for a component you can always
> inject the `BREADCRUMB_ITEMS` token (a simple BehaviorSubject) or the existing `BreadcrumbService` inside your component and create the breadcrumbs manually eg:
>
> ```typescript
> constructor(@Inject(BREADCRUMB_ITEMS) private breadcrumbs$: BehaviorSubject<BreadcrumbItem[]>) {
>   this.breadcrumbs$.next(...);
> }
> // OR
> constructor(private breadcrumbService: BreadcrumbService) {
>   this.breadcrumbService.show(...);
> }
> ```
>
> If you need to do this however please maintain current breadcrumb functionality patterns

---

## Back links

Back links can only be defined on a route's data property.  
They can be one of:

- `string`: In this case you must provide a url relative to the current route e.g

```typescript
const routes: Routes = [
  {
    path: '',
    component: ManagementProceduresRolesComponent,
  },
  {
    path: 'documentation',
    data: { backlink: '../' },
    component: ManagementProceduresDocumentationComponent,
  },
  {
    path: 'responsibilities',
    data: { backlink: '../documentation' },
    component: ManagementProceduresResponsibilitiesComponent,
  },
];
```

- `function`: The function must be of the form `(data: Data) => string` where `data` is the route's data. This is
  commonly used together with a [ResolveFn](https://angular.io/api/router/ResolveFn) that can populate the route's
  data with relevant information. You can then extract the info you need from the `Data` object to get the
  back link url e.g.

```typescript
const resolveEnvironmentalManagementBackLink: ResolveFn<any> = () => {
  return inject(RequestTaskStore).pipe(
    monitoringApproachQuery.selectMonitoringApproach,
    map((approach) => {
      return approach.monitoringApproachType === 'FUEL_USE_MONITORING' ? '../uplift-quantity' : '../risks';
    }),
  );
};

const route = {
  path: 'environmental-management',
  data: { backlink: ({ backlinkUrl }) => backlinkUrl },
  resolve: { backlinkUrl: resolveEnvironmentalManagementBackLink },
  component: EnvironmentalManagementComponent,
};
```

## TODO:

- Add breadcrumbs to vir, dre, actions(installation) and permit-notification routes

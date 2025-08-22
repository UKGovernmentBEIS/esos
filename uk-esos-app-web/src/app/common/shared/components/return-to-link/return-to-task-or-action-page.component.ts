import { ChangeDetectionStrategy, Component, computed, Inject, Optional, signal } from '@angular/core';
import { ActivatedRoute, RouterLinkWithHref } from '@angular/router';

import { GovukComponentsModule } from 'govuk-components';

import { RequestActionStore } from '../../../request-action/+state';
import { RequestTaskStore } from '../../../request-task/+state';
import { ITEM_TYPE_TO_RETURN_TEXT_MAPPER, selectType, TYPE_AWARE_STORE } from '../../../store';

@Component({
  selector: 'esos-return-to-task-or-action-page',
  standalone: true,
  imports: [RouterLinkWithHref, GovukComponentsModule],
  template: `<a govukLink [routerLink]="returnToUrl()"> Return to: {{ returnToText() }} </a> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnToTaskOrActionPageComponent {
  readonly returnToUrl = signal(['']);
  readonly returnToText = computed(() => {
    if (!!this.store && !!this.typeToText) {
      const type = this.store.select(selectType)();
      return this.typeToText(type) ?? 'Dashboard';
    }

    console.warn(`
      ReturnToTaskOrActionPageComponent ::
      No TYPE_AWARE_STORE and/or ITEM_TYPE_TO_RETURN_TEXT_MAPPER dependency found
    `);
    return 'Dashboard';
  });

  constructor(
    @Optional() @Inject(TYPE_AWARE_STORE) private readonly store: RequestTaskStore | RequestActionStore,
    @Optional() @Inject(ITEM_TYPE_TO_RETURN_TEXT_MAPPER) private readonly typeToText: (type: string) => string,
    private readonly route: ActivatedRoute,
  ) {
    let returnRoute = this.route;
    while (!!returnRoute.parent && ![':actionId', ':taskId'].includes(returnRoute.routeConfig?.path)) {
      returnRoute = returnRoute.parent;
    }

    const url = returnRoute.snapshot.pathFromRoot.map((route) => route.url.map((u) => u.path)).flat();
    url[0] = `/${url[0]}`;
    this.returnToUrl.set(url);
  }
}

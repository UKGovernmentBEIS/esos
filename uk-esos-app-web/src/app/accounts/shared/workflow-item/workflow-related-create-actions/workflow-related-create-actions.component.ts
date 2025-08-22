import { AsyncPipe, I18nSelectPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { combineLatest, Observable, switchMap, takeUntil } from 'rxjs';

import { DestroySubject } from '@core/services/destroy-subject.service';
import { RelatedContentComponent } from '@shared/components/related-content/related-content.component';
import { ItemLinkPipe } from '@shared/pipes/item-link.pipe';

import { LinkDirective } from 'govuk-components';

import {
  RequestCreateActionProcessDTO,
  RequestCreateActionProcessResponseDTO,
  RequestItemsService,
  RequestsService,
} from 'esos-api';

import { createRequestCreateActionProcessDTO, reinitiateTaskMap } from './workflowCreateAction';

@Component({
  selector: 'esos-workflow-related-create-actions',
  template: `
    <esos-related-content header="Related actions">
      <ul class="govuk-list govuk-!-font-size-16">
        @for (requestCreateActionType of requestCreateActionsTypes$ | async; track $index) {
          <li>
            <a govukLink routerLink="." (click)="onClick(requestCreateActionType)">{{
              requestCreateActionType | i18nSelect: requestCreateActionTypeLabelMap
            }}</a>
          </li>
        }
      </ul>
    </esos-related-content>
  `,
  standalone: true,
  imports: [RouterLink, RelatedContentComponent, I18nSelectPipe, LinkDirective, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroySubject],
})
export class WorkflowRelatedCreateActionsComponent {
  @Input() accountId$: Observable<number>;
  @Input() requestId$: Observable<string>;
  @Input() requestCreateActionsTypes$: Observable<RequestCreateActionProcessDTO['requestCreateActionType'][]>;

  requestCreateActionTypeLabelMap: Partial<Record<RequestCreateActionProcessDTO['requestCreateActionType'], string>> =
    reinitiateTaskMap.reduce((acc, item) => ({ ...acc, [item.requestCreateActionType]: item.relatedActionLabel }), {});

  private reinitiateTaskPathMap: Partial<Record<RequestCreateActionProcessDTO['requestCreateActionType'], string>> =
    reinitiateTaskMap.reduce((acc, item) => ({ ...acc, [item.requestCreateActionType]: item.taskTypePath }), {});

  constructor(
    private readonly requestsService: RequestsService,
    private readonly requestItemsService: RequestItemsService,
    private readonly destroy$: DestroySubject,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  onClick(requestCreateActionType: RequestCreateActionProcessDTO['requestCreateActionType']): void {
    switch (requestCreateActionType) {
      case 'RE_INITIATE_NOTIFICATION_OF_COMPLIANCE_P3':
      case 'RE_INITIATE_ACTION_PLAN_P3':
      case 'RE_INITIATE_PROGRESS_UPDATE_1_P3':
      case 'RE_INITIATE_PROGRESS_UPDATE_2_P3':
        this.router.navigate([`reinitiate/${this.reinitiateTaskPathMap[requestCreateActionType]}`], {
          relativeTo: this.route,
        });
        break;
      default:
        combineLatest([this.requestId$, this.accountId$])
          .pipe(
            takeUntil(this.destroy$),
            switchMap(([requestId, accountId]) =>
              this.requestsService.processRequestCreateAction(
                createRequestCreateActionProcessDTO(requestCreateActionType, requestId),
                accountId,
              ),
            ),
            switchMap((response: RequestCreateActionProcessResponseDTO) =>
              this.requestItemsService.getItemsByRequest(response.requestId),
            ),
          )
          .subscribe(({ items }) => {
            const itemLinkPipe = new ItemLinkPipe();
            const link = items?.length == 1 ? itemLinkPipe.transform(items[0]) : ['/dashboard'];
            this.router.navigate(link);
          });
        break;
    }
  }
}

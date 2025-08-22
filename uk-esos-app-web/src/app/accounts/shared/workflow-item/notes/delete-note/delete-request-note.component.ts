import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { first, map, switchMap, withLatestFrom } from 'rxjs';

import { PendingRequestService } from '@core/guards/pending-request.service';
import { DestroySubject } from '@core/services/destroy-subject.service';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PendingButtonDirective } from '@shared/pending-button.directive';

import { GovukComponentsModule } from 'govuk-components';

import { RequestNotesService } from 'esos-api';

import { WorkflowItemAbstractComponent } from '../../workflow-item-abstract.component';

@Component({
  selector: 'esos-delete-request-note',
  templateUrl: './delete-request-note.component.html',
  standalone: true,
  imports: [GovukComponentsModule, PageHeadingComponent, RouterLink, PendingButtonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroySubject],
})
export class DeleteRequestNoteComponent extends WorkflowItemAbstractComponent {
  constructor(
    protected readonly router: Router,
    protected readonly route: ActivatedRoute,
    private readonly requestNotesService: RequestNotesService,
    private readonly pendingRequest: PendingRequestService,
  ) {
    super(router, route);
  }

  onDelete() {
    this.route.paramMap
      .pipe(
        first(),
        map((parameters) => +parameters.get('noteId')),
        switchMap((noteId) => this.requestNotesService.deleteRequestNote(noteId)),
        withLatestFrom(this.accountId$, this.prefixUrl$, this.requestId$),
        this.pendingRequest.trackRequest(),
      )
      //eslint-disable-next-line @typescript-eslint/no-unused-vars
      .subscribe(([response, accountId, prefixUrl, requestId]) =>
        this.router.navigate([accountId ? `${prefixUrl}/workflows/${requestId}` : `${prefixUrl}/${requestId}`], {
          fragment: 'notes',
        }),
      );
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject, map, tap } from 'rxjs';

@Component({
  selector: 'esos-invalid-invitation-link',
  templateUrl: './invalid-invitation-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvalidInvitationLinkComponent {
  title$ = new BehaviorSubject<string>('');

  error$ = this.activatedRoute.queryParamMap.pipe(
    map((params) => params.get('code')),
    tap((code) => {
      const titileErrorMessages: Record<string, string> = {
        EMAIL1001: 'This link has expired',
        TOKEN1002: 'This link is invalid',
      };

      const title: string = titileErrorMessages[code] ?? 'This link is invalid';

      this.title$.next(title);
      this.titleService.setTitle(title);
    }),
  );

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly titleService: Title,
  ) {}
}

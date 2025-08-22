import { ChangeDetectionStrategy, Component } from '@angular/core';

import { first, map, Observable, of, switchMap } from 'rxjs';

import { AuthService } from '@core/services/auth.service';
import { AuthStore, selectUserState } from '@core/store';
import { BaseSuccessComponent } from '@shared/base-success/base-success.component';
import { SharedModule } from '@shared/shared.module';

import { UserStateDTO } from 'esos-api';

@Component({
  selector: 'esos-organisation-account-application-received',
  templateUrl: './organisation-account-application-received.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SharedModule],
})
export class OrganisationAccountApplicationReceivedComponent extends BaseSuccessComponent {
  isChangedUserState: Observable<boolean> = this.authStore.pipe(
    selectUserState,
    first(),
    switchMap((userState) =>
      userState.status === 'ENABLED' ? of({} as UserStateDTO) : this.authService.loadUserState(),
    ),
    map((newUserState) => newUserState?.status === 'ENABLED'),
  );

  constructor(private readonly authStore: AuthStore, private readonly authService: AuthService) {
    super();
  }
}

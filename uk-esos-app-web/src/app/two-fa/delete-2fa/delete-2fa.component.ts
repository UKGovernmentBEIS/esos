import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { first, map, of, switchMap } from 'rxjs';

import { UsersSecuritySetupService } from 'esos-api';

import { AuthService } from '../../core/services/auth.service';
import { catchBadRequest, ErrorCodes } from '../../error/business-errors';

@Component({
  selector: 'esos-delete-2fa',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Delete2faComponent implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly usersSecuritySetupService: UsersSecuritySetupService,
    private readonly authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        map((params) => params.get('token')),
        first(),
        switchMap((change2FaToken) => this.usersSecuritySetupService.deleteOtpCredentials({ token: change2FaToken })),
        map(() => ({ url: 'success' })),
        catchBadRequest([ErrorCodes.EMAIL1001, ErrorCodes.TOKEN1001, ErrorCodes.USER1005], (res) =>
          of({ url: 'invalid-link', queryParams: { code: res.error.code } }),
        ),
      )
      .subscribe(({ queryParams, url }: { url: string; queryParams?: any }) => {
        if (url === 'success') {
          this.authService.logout('/');
        } else {
          this.router.navigate(['2fa', url], { queryParams });
        }
      });
  }
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ResetTwoFaComponent } from './reset-two-fa/reset-two-fa.component';

const routes: Routes = [
  {
    path: 'reset-2fa',
    title: 'Reset two factor authentication',
    data: { breadcrumb: true },
    component: ResetTwoFaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TwoFaRoutingModule {}

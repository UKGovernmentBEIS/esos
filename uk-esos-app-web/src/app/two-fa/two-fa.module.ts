import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BackToTopComponent } from '@shared/back-to-top/back-to-top.component';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PendingButtonDirective } from '@shared/pending-button.directive';
import { SharedModule } from '@shared/shared.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';

import { ResetTwoFaComponent } from './reset-two-fa/reset-two-fa.component';
import { TwoFaRoutingModule } from './two-fa-routing.module';

@NgModule({
  declarations: [ResetTwoFaComponent],
  imports: [
    BackToTopComponent,
    CommonModule,
    PageHeadingComponent,
    PendingButtonDirective,
    SharedModule,
    TwoFaRoutingModule,
    WizardStepComponent,
  ],
})
export class TwoFaModule {}

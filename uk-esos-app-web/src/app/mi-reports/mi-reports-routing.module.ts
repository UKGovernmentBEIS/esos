import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PendingRequestGuard } from '@core/guards/pending-request.guard';

import { AccountsUsersContactsComponent } from './accounts-users-contacts/accounts-users-contacts.component';
import { ActionPlanPublishedDataComponent } from './action-plan-published-data/action-plan-published-data.component';
import { miReportTypeDescriptionMap } from './core/mi-report';
import { MiReportsListGuard } from './core/mi-reports-list.guard';
import { CustomReportComponent } from './custom/custom.component';
import { MiReportsComponent } from './mi-reports.component';
import { ProgressUpdate1PublishedDataComponent } from './pu1-published-data/pu1-published-data.component';
import { ProgressUpdate2PublishedDataComponent } from './pu2-published-data/pu2-published-data.component';
import { SubmittedNocsComponent } from './submitted-nocs/submitted-nocs.component';

const routes: Routes = [
  {
    path: '',
    title: 'MI Reports',
    component: MiReportsComponent,
    canActivate: [MiReportsListGuard],
    resolve: { miReports: MiReportsListGuard },
  },
  {
    path: 'accounts-users-contacts',
    title: miReportTypeDescriptionMap['LIST_OF_ACCOUNTS_USERS_CONTACTS'],
    data: { breadcrumb: miReportTypeDescriptionMap['LIST_OF_ACCOUNTS_USERS_CONTACTS'] },
    component: AccountsUsersContactsComponent,
  },
  {
    path: 'custom',
    title: miReportTypeDescriptionMap['CUSTOM'],
    data: { breadcrumb: miReportTypeDescriptionMap['CUSTOM'] },
    component: CustomReportComponent,
  },
  {
    path: 'submitted-nocs',
    title: miReportTypeDescriptionMap['NOC_SUBMITTED_DATA_P3'],
    data: { breadcrumb: miReportTypeDescriptionMap['NOC_SUBMITTED_DATA_P3'] },
    component: SubmittedNocsComponent,
    canDeactivate: [PendingRequestGuard],
  },
  {
    path: 'action-plan-published-data',
    title: miReportTypeDescriptionMap['ACTION_PLAN_SUBMITTED_DATA_P3'],
    data: { breadcrumb: miReportTypeDescriptionMap['ACTION_PLAN_SUBMITTED_DATA_P3'] },
    component: ActionPlanPublishedDataComponent,
    canDeactivate: [PendingRequestGuard],
  },
  {
    path: 'progress-update-1-published-data',
    title: miReportTypeDescriptionMap['PROGRESS_UPDATE_1_SUBMITTED_DATA_P3'],
    data: { breadcrumb: miReportTypeDescriptionMap['PROGRESS_UPDATE_1_SUBMITTED_DATA_P3'] },
    component: ProgressUpdate1PublishedDataComponent,
    canDeactivate: [PendingRequestGuard],
  },
  {
    path: 'progress-update-2-published-data',
    title: miReportTypeDescriptionMap['PROGRESS_UPDATE_2_SUBMITTED_DATA_P3'],
    data: { breadcrumb: miReportTypeDescriptionMap['PROGRESS_UPDATE_2_SUBMITTED_DATA_P3'] },
    component: ProgressUpdate2PublishedDataComponent,
    canDeactivate: [PendingRequestGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MiReportsRoutingModule {}

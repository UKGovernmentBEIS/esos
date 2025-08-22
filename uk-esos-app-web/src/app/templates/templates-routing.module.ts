import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PendingRequestGuard } from '@core/guards/pending-request.guard';

import { DocumentTemplateGuard } from './document/document-template.guard';
import { DocumentTemplateOverviewComponent } from './document/document-template-overview.component';
import { DocumentTemplateComponent } from './document/edit/document-template.component';
import { EmailTemplateComponent } from './email/edit/email-template.component';
import { EmailTemplateGuard } from './email/email-template.guard';
import { EmailTemplateOverviewComponent } from './email/email-template-overview.component';
import { TemplateFileDownloadComponent } from './file-download/template-file-download.component';
import { TemplatesComponent } from './templates.component';

const routes: Routes = [
  {
    path: '',
    component: TemplatesComponent,
  },
  {
    path: 'email/:templateId',
    children: [
      {
        path: '',
        title: 'Email template',
        data: {
          breadcrumb: ({ emailTemplate }) => emailTemplate.name,
        },
        component: EmailTemplateOverviewComponent,
        canActivate: [EmailTemplateGuard],
        resolve: { emailTemplate: EmailTemplateGuard },
      },
      {
        path: 'edit',
        title: 'Edit email template',
        data: {
          breadcrumb: ({ emailTemplate }) => `Edit ${emailTemplate.name}`,
        },
        component: EmailTemplateComponent,
        canActivate: [EmailTemplateGuard],
        canDeactivate: [PendingRequestGuard],
        resolve: { emailTemplate: EmailTemplateGuard },
      },
    ],
  },
  {
    path: 'document/:templateId',
    children: [
      {
        path: '',
        title: 'Document template',
        data: {
          breadcrumb: ({ documentTemplate }) => documentTemplate.name,
        },
        component: DocumentTemplateOverviewComponent,
        canActivate: [DocumentTemplateGuard],
        resolve: { documentTemplate: DocumentTemplateGuard },
      },
      {
        path: 'edit',
        title: 'Edit document template',
        data: {
          breadcrumb: ({ documentTemplate }) => `Edit ${documentTemplate.name}`,
        },
        component: DocumentTemplateComponent,
        canActivate: [DocumentTemplateGuard],
        canDeactivate: [PendingRequestGuard],
        resolve: { documentTemplate: DocumentTemplateGuard },
      },
      {
        path: 'file-download/:uuid',
        title: 'Download file',
        component: TemplateFileDownloadComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TemplatesRoutingModule {}

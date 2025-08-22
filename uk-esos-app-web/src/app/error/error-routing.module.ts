import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BusinessErrorComponent } from './business-error/business-error.component';
import { InternalServerErrorComponent } from './internal-server-error/internal-server-error.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '500',
    title: 'Sorry, there is a problem with the service',
    component: InternalServerErrorComponent,
  },
  {
    path: 'business',
    component: BusinessErrorComponent,
  },
  {
    path: '404',
    title: 'Page not found',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorRoutingModule {}

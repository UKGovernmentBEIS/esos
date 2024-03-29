import { Directive } from '@angular/core';

import { TabBaseDirective } from './tab-base.directive';

@Directive({
  selector: 'ng-template[govukTab]',
  standalone: true,
  providers: [{ provide: TabBaseDirective, useExisting: TabDirective }],
})
export class TabDirective extends TabBaseDirective {}

import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { GovukPaginationBlock } from './pagination-block.interface';

@Component({
  selector: 'govuk-pagination-block',
  templateUrl: './pagination-block.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgIf],
})
export class PaginationBlockComponent {
  @Input() previous: GovukPaginationBlock;
  @Input() next: GovukPaginationBlock;
}

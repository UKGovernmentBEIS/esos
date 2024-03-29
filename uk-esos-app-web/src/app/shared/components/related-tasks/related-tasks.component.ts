import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { DaysRemainingPipe } from '@shared/pipes/days-remaining.pipe';
import { ItemLinkPipe } from '@shared/pipes/item-link.pipe';
import { ItemNamePipe } from '@shared/pipes/item-name.pipe';

import { ItemDTO } from 'esos-api';

/**
 * Marked for refactor
 * Split floats to grid
 */
@Component({
  selector: 'esos-related-tasks',
  standalone: true,
  templateUrl: './related-tasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, NgFor, RouterLink, DaysRemainingPipe, ItemNamePipe, ItemLinkPipe],
})
export class RelatedTasksComponent {
  @Input() items: ItemDTO[];
  @Input() heading = 'Related tasks';
  @Input() noBorders = false;

  constructor(public readonly router: Router) {}
}

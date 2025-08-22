import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { BehaviorSubject, map } from 'rxjs';

@Component({
  selector: 'esos-show-hide',
  standalone: true,
  imports: [NgIf, NgForOf, AsyncPipe],
  templateUrl: './show-hide.component.html',
  styleUrls: ['./show-hide.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowHideComponent {
  @Input({ required: true }) header: string;
  @Input({ required: true }) itemIndex: number;
  @Input({ required: true }) label: string;

  isExpanded$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  ariaLabel$ = this.isExpanded$.pipe(
    map((isExpanded) => (isExpanded ? `${this.label} , Hide this section` : `${this.label} , Show this section`)),
  );

  get id() {
    return `show-hide-content-${this.itemIndex}`;
  }
}

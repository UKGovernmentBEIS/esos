import { NgIf, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Input, OnInit, Signal, signal } from '@angular/core';

@Component({
  selector: 'esos-more-less-text',
  standalone: true,
  imports: [NgIf, NgStyle],
  templateUrl: './more-less.component.html',
  styleUrls: ['./more-less.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoreLessComponent implements OnInit {
  @Input() text: string;
  @Input() index: number;
  @Input() widthClass: string;
  @Input() lines: number;

  moreIsClicked = signal(false);
  class: Signal<string> = signal('initial-class');
  isTextOverflow: Signal<boolean>;

  ngOnInit(): void {
    this.widthClass = this.lines ? `${this.widthClass} pre-wrap` : this.widthClass;
    this.isTextOverflow = computed(() => {
      const elem = document.getElementById(`more-less-text-${this.index}`);

      if (this.lines) {
        return elem.clientHeight < elem.scrollHeight || this.moreIsClicked();
      } else {
        return elem.offsetWidth < elem.scrollWidth || this.moreIsClicked();
      }
    });

    this.class = computed(
      () => `${!this.moreIsClicked() ? (this.lines ? 'cell-ellipsis-multi-line' : 'cell-ellipsis-single-line') : ''}`,
    );
  }

  moreLessClicked() {
    this.moreIsClicked.update((v) => !v);
  }
}

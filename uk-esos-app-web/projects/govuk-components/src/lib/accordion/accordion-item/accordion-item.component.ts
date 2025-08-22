import { AsyncPipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import { BehaviorSubject, Observable, Subject, takeUntil, tap } from 'rxjs';

import { ACCORDION, Accordion, isSessionStorageAvailable } from '../accordion';

@Component({
  selector: 'govuk-accordion-item',
  standalone: true,
  imports: [AsyncPipe, NgIf],
  templateUrl: './accordion-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionItemComponent implements OnInit, OnDestroy {
  @Input({ required: true }) header: string;
  @Input() summary: string;
  @Output() readonly expand = new EventEmitter<boolean>();

  itemIndex: number;
  isFocused = false;
  isExpanded: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isExpanded$: Observable<boolean> = this.isExpanded.asObservable().pipe(tap(() => this.storeState()));

  readonly destroy$ = new Subject<void>();

  constructor(@Inject(ACCORDION) public accordion: Accordion) {}

  get headingId(): string {
    return `${this.accordion.id}-heading-${this.itemIndex}`;
  }

  get summaryId(): string {
    return `${this.accordion.id}-summary-${this.itemIndex}`;
  }

  get contentId(): string {
    return `${this.accordion.id}-content-${this.itemIndex}`;
  }

  ngOnInit(): void {
    this.itemIndex = ++this.accordion.itemCount;

    if (Array.isArray(this.accordion.openIndexes)) {
      this.isExpanded.next(this.accordion.openIndexes.includes(this.itemIndex));
    } else if (!this.accordion.cacheDisabled && isSessionStorageAvailable()) {
      this.isExpanded.next(sessionStorage.getItem(this.contentId) === 'true');
    }

    this.isExpanded.pipe(takeUntil(this.destroy$)).subscribe((value) => this.expand.emit(value));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  private storeState(): void {
    if (!this.accordion.cacheDisabled && isSessionStorageAvailable()) {
      sessionStorage.setItem(this.contentId, String(this.isExpanded.value));
    }
  }
}

import { AsyncPipe } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';

import { Observable, startWith, tap } from 'rxjs';

import { ConditionalContentDirective, GovukComponentsModule, LegendSizeType, RadioComponent } from 'govuk-components';

import { existingControlContainer } from '../providers/control-container.factory';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esos-boolean-radio-group',
  templateUrl: './boolean-radio-group.component.html',
  providers: [existingControlContainer],
  viewProviders: [existingControlContainer],
  standalone: true,
  imports: [GovukComponentsModule, ReactiveFormsModule, AsyncPipe],
})
export class BooleanRadioGroupComponent implements AfterContentInit, AfterViewInit, OnInit {
  @Input() controlName: string;
  @Input() legend: string;
  @Input() legendSize: LegendSizeType = 'medium';
  @Input() hint: string;
  @Input() isEditable = true;

  @Input() yesLabel = 'Yes';
  @Input() noLabel = 'No';

  @ViewChild(RadioComponent, { read: ElementRef, static: true }) radio: ElementRef<HTMLElement>;
  value$: Observable<boolean>;

  private yesRadio: HTMLInputElement;
  @ContentChild(ConditionalContentDirective, { static: true })
  private readonly conditional: ConditionalContentDirective;

  constructor(
    private readonly controlContainer: ControlContainer,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  get conditionalId() {
    return `${this.yesRadio?.id}-conditional`;
  }

  private get control() {
    return this.controlContainer.control.get(this.controlName);
  }

  ngOnInit(): void {
    this.value$ = this.control.valueChanges.pipe(
      startWith(this.control.value),
      tap((value) => this.onChoose(value)),
    );
  }

  ngAfterContentInit() {
    this.onChoose(this.control.value);
  }

  ngAfterViewInit(): void {
    this.yesRadio = this.radio.nativeElement.querySelector('input');
    this.yesRadio.setAttribute('aria-controls', this.conditionalId);
    this.setAriaExpanded(this.control.value);

    // Trigger a change detection to update the conditionalId
    this.changeDetectorRef.detectChanges();
  }

  private onChoose(value: boolean): void {
    this.setAriaExpanded(value);

    if (this.conditional) {
      if (value && this.isEditable) {
        this.conditional.enableControls();
      } else {
        this.conditional.disableControls();
      }
    }
  }

  private setAriaExpanded(value: boolean): void {
    if (this.yesRadio) {
      this.yesRadio.setAttribute('aria-expanded', value ? 'true' : 'false');
    }
  }
}

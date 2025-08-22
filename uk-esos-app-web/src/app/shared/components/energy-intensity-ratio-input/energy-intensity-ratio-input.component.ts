import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { existingControlContainer } from '@shared/providers/control-container.factory';

import { GovukComponentsModule } from 'govuk-components';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esos-energy-intensity-ratio-input',
  templateUrl: './energy-intensity-ratio-input.component.html',
  imports: [ReactiveFormsModule, GovukComponentsModule, NgIf, NgFor, RouterLink],
  standalone: true,
  viewProviders: [existingControlContainer],
})
export class EnergyIntensityRatioInputComponent {
  @Input() intensityRatioFormArray: FormArray;
  @Input() type: string;

  @Output() readonly addRatioGroupEvent = new EventEmitter<string>();
  @Output() readonly deleteRatioGroupEvent = new EventEmitter<{ type: string; index: number }>();

  addRatioGroup() {
    this.addRatioGroupEvent.emit(this.type);
  }

  deleteRatioGroup(index: number) {
    this.deleteRatioGroupEvent.emit({ type: this.type, index });
  }
}

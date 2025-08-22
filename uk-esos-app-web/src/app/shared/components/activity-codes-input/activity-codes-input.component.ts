import { NgForOf, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormGroup,
} from '@angular/forms';

import { addCodeFormControl } from '@shared/components/activity-codes-input/activity-codes-input';
import { existingControlContainer } from '@shared/providers/control-container.factory';

import {
  ButtonDirective,
  GovukSelectOption,
  LinkDirective,
  SelectComponent,
  TextInputComponent,
} from 'govuk-components';

import { OrganisationAccountDTO } from 'esos-api';

/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
@Component({
  selector: 'esos-activity-codes-input',
  standalone: true,
  imports: [ButtonDirective, ReactiveFormsModule, SelectComponent, NgIf, TextInputComponent, LinkDirective, NgForOf],
  templateUrl: './activity-codes-input.component.html',
  viewProviders: [existingControlContainer],
})
export class ActivityCodesInputComponent implements OnInit {
  @Input() disabled = false;

  form: FormGroup;
  codeFormArray: FormArray;
  accountTypeOptions: GovukSelectOption<OrganisationAccountDTO['type']>[] = [
    {
      value: 'SIC',
      text: 'SIC',
    },
    {
      value: 'OTHER',
      text: 'Other',
    },
  ];

  constructor(private readonly controlContainer: ControlContainer) {}

  ngOnInit(): void {
    this.form = this.controlContainer.control as UntypedFormGroup;
    this.codeFormArray = this.form.get('codes') as UntypedFormArray;
    this.codeFormArray.markAsDirty();
  }

  addCode(): void {
    this.codeFormArray.push(addCodeFormControl());
    this.codeFormArray.at(this.codeFormArray.length - 1);
    this.codeFormArray.markAsDirty();
  }

  removeCode(index: number) {
    this.codeFormArray.removeAt(index);
  }
}

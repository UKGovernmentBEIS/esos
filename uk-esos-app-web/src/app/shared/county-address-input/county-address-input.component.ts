import { Component, OnInit } from '@angular/core';
import { ControlContainer, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { GovukValidators } from 'govuk-components';

import { CountyAddressDTO } from 'esos-api';

import { existingControlContainer } from '../providers/control-container.factory';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esos-county-address-input',
  templateUrl: './county-address-input.component.html',
  viewProviders: [existingControlContainer],
})
export class CountyAddressInputComponent implements OnInit {
  form: UntypedFormGroup;

  static controlsFactory(address: CountyAddressDTO): Record<keyof CountyAddressDTO, UntypedFormControl> {
    return {
      line1: new UntypedFormControl(address?.line1, [
        GovukValidators.required('Enter an address'),
        GovukValidators.maxLength(255, 'The address should not be more than 255 characters'),
      ]),
      line2: new UntypedFormControl(
        address?.line2,
        GovukValidators.maxLength(255, 'The address should not be more than 255 characters'),
      ),
      city: new UntypedFormControl(address?.city, [
        GovukValidators.required('Enter a town or city'),
        GovukValidators.maxLength(255, 'The city should not be more than 255 characters'),
      ]),
      postcode: new UntypedFormControl(address?.postcode, [
        GovukValidators.required('Enter a postcode'),
        GovukValidators.maxLength(64, 'The postcode should not be more than 64 characters'),
      ]),
      county: new UntypedFormControl(address?.county, [
        GovukValidators.maxLength(255, 'The county should not be more than 255 characters'),
      ]),
    };
  }

  constructor(private controlContainer: ControlContainer) {}

  ngOnInit(): void {
    this.form = this.controlContainer.control as UntypedFormGroup;
  }
}

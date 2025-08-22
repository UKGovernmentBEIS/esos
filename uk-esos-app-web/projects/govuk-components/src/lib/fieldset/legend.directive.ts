import { AfterContentInit, Directive, ElementRef, HostBinding, Input } from '@angular/core';

import { FieldsetDirective } from './fieldset.directive';
import { LegendSizeType } from './legend-size.type';

@Directive({ selector: 'legend[govukLegend],ng-template[govukLegend]', standalone: true })
export class LegendDirective implements AfterContentInit {
  @Input() size: LegendSizeType;

  constructor(
    private readonly fieldset: FieldsetDirective,
    private readonly elementRef: ElementRef,
  ) {}

  @HostBinding('class') get sizeClass() {
    switch (this.size) {
      case 'heading':
      case 'large':
        return 'govuk-fieldset__legend govuk-fieldset__legend--l';
      case 'normal':
        return 'govuk-fieldset__legend';
      case 'small':
        return 'govuk-fieldset__legend govuk-fieldset__legend--s';
      default:
        return 'govuk-fieldset__legend govuk-fieldset__legend--m';
    }
  }

  @HostBinding('attr.id') get identifier() {
    return `l.${this.fieldset.identifier}`;
  }

  private get nativeElement(): HTMLLegendElement {
    return this.elementRef.nativeElement;
  }

  ngAfterContentInit(): void {
    const heading = this.nativeElement.querySelector('h1');

    if (heading && this.size === 'heading') {
      heading.classList.add('govuk-fieldset__heading');
    }
  }
}

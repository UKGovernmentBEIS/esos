import { AsyncPipe, I18nPluralPipe, NgForOf, NgIf } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
} from '@angular/core';
import { AbstractControl, FormControlStatus, NgForm, UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { map, Observable, startWith, tap } from 'rxjs';

import { NestedMessageValidationError } from '@shared/csv-error-summary/nested-message-validation-error.interface';

import { DetailsComponent, FormService } from 'govuk-components';

@Component({
  selector: 'esos-csv-error-summary',
  standalone: true,
  imports: [AsyncPipe, DetailsComponent, NgIf, NgForOf, I18nPluralPipe],
  templateUrl: './csv-error-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CsvErrorSummaryComponent implements OnChanges, AfterViewInit {
  @Input() form: UntypedFormGroup | NgForm;
  @ViewChild('container', { read: ElementRef }) container: ElementRef<HTMLDivElement>;

  columnsPluralMapping: { [k: string]: string } = {
    '=1': 'column',
    other: 'columns',
  };
  errorList$: Observable<NestedMessageValidationError[]>;

  private formControl: UntypedFormGroup;

  constructor(private readonly formService: FormService, private readonly title: Title) {}

  ngOnChanges(): void {
    this.formControl = this.form instanceof UntypedFormGroup ? this.form : this.form.control;

    const statusChanges: Observable<FormControlStatus> = this.form.statusChanges;
    this.errorList$ = statusChanges.pipe(
      startWith(this.form.status),
      map((status) => (status === 'INVALID' ? this.getAbstractControlErrors(this.formControl) : null)),
      tap((errors) => {
        const currentTitle = this.title.getTitle();
        const prefix = 'Error: ';

        if (errors && !currentTitle.startsWith(prefix)) {
          this.title.setTitle(prefix.concat(currentTitle));
        } else if (!errors) {
          this.title.setTitle(currentTitle.replace(prefix, ''));
        }
      }),
    );
  }

  ngAfterViewInit(): void {
    if (this.container?.nativeElement?.scrollIntoView) {
      this.container.nativeElement.scrollIntoView();
    }
    if (this.container?.nativeElement?.focus) {
      this.container.nativeElement.focus();
    }
  }

  private getAbstractControlErrors(control: AbstractControl, path: string[] = []): NestedMessageValidationError[] {
    let childControlErrors = [];

    if (control instanceof UntypedFormGroup) {
      childControlErrors = Object.entries(control.controls)
        .map(([key, value]) => this.getAbstractControlErrors(value, path.concat([key])))
        .reduce((errors, controlErrors) => errors.concat(controlErrors), []);
    } else if (control instanceof UntypedFormArray) {
      childControlErrors = control.controls
        .map((arrayControlItem, index) => this.getAbstractControlErrors(arrayControlItem, path.concat([String(index)])))
        .reduce((errors, controlErrors) => errors.concat(controlErrors), []);
    }

    const errors = control.errors;

    if (errors) {
      const errorEntries = Object.keys(errors).map((key) => ({
        type: key,
        path: this.formService.getIdentifier(path),
        ...errors[key],
      }));
      return childControlErrors.concat(errorEntries);
    }

    return childControlErrors;
  }

  getRowIndexes(rows: any[]): number[] {
    return rows.map((row) => row.rowIndex);
  }
}

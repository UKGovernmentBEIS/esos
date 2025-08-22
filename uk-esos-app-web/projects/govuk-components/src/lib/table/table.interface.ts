import { GovukTextWidthClass } from '../text-input/text-input.type';

export interface GovukTableColumn<T = any> {
  header: string;
  field: keyof T;
  widthClass?: GovukTextWidthClass | string;
  isSortable?: boolean;
  isHeader?: boolean;
  isHidden?: boolean;
}

export interface SortEvent {
  column: GovukTableColumn['field'];
  direction: 'ascending' | 'descending';
}

import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  Input,
  Output,
  Signal,
  signal,
} from '@angular/core';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';

import { MoreLessComponent } from '@shared/more-less/more-less.component';
import { ShowActivityCodesComponent } from '@shared/show-activity-codes/show-activity-codes.component';

import { GovukTableColumn, LinkDirective, PaginationComponent, TableComponent } from 'govuk-components';

import { OrganisationAssociatedWithRU, OrganisationStructure } from 'esos-api';

import { sortOrganisations } from './organisations-structure-list-template.helper';
import { OrganisationStructureListTemplateViewModel } from './organisations-structure-list-template.types';

/**
 * Ensure a type with index so that we have a global index as reference
 * and not the index displayed, starting from 0
 */
type OrganisationTableElement = Partial<OrganisationAssociatedWithRU> & { index: number };

@Component({
  selector: 'esos-organisation-structure-list-table',
  standalone: true,
  imports: [
    LinkDirective,
    MoreLessComponent,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    RouterLink,
    TableComponent,
    ShowActivityCodesComponent,
    PaginationComponent,
  ],
  templateUrl: './organisations-structure-list-template.component.html',
  styleUrls: ['./organisations-structure-list-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationStructureListTableComponent {
  @Input() vm: OrganisationStructureListTemplateViewModel;
  @Input() organisationStructure: Signal<OrganisationStructure>;
  @Output() readonly removeOrganisation = new EventEmitter<number>();
  @Input() queryParams: Params;
  @Input() allowPagination = true;

  readonly pageSize = 10;

  page = signal(
    this.route.snapshot.queryParamMap.has('page') ? Number(this.route.snapshot.queryParamMap.get('page')) : 1,
  );
  allOrganisations = computed(() => {
    const sortedIndexedOrganisationsRU: OrganisationTableElement[] = sortOrganisations(
      this.organisationStructure()?.organisationsAssociatedWithRU ?? [],
    ).map((item, index) => ({
      index: index + 1,
      ...item,
    }));

    return [this.addResponsibleUndertaking(), ...sortedIndexedOrganisationsRU];
  });
  organisationsLength: Signal<number> = computed(() => this.allOrganisations().length);
  organisations: Signal<OrganisationTableElement[]> = computed(() => {
    const page = this.page();
    const pageStart = (page - 1) * this.pageSize;
    const pageEnd = page * this.pageSize;

    return this.allowPagination
      ? this.allOrganisations().filter((_, index) => index < pageEnd && index >= pageStart)
      : this.allOrganisations();
  });

  tableColumns: GovukTableColumn[] = [
    { field: 'organisationDetails', header: 'Organisation', widthClass: 'org-details-width' },
    { field: 'isPartOfArrangement', header: 'Co-parent organisation included' },
    { field: 'isParentOfResponsibleUndertaking', header: 'Parent of this RU' },
    { field: 'isSubsidiaryOfResponsibleUndertaking', header: 'Subsidiary of this RU' },
    { field: 'isPartOfFranchise', header: 'Franchisee' },
    { field: 'hasCeasedToBePartOfGroup', header: 'Ceased to be part of group' },
    { field: 'links', header: undefined },
  ];

  constructor(private readonly route: ActivatedRoute) {}

  private addResponsibleUndertaking(): OrganisationTableElement {
    const ruOrganisationDetails = this.vm.organisationDetails;

    const { organisationsAssociatedWithRU, ...ruOrganisation } = this.organisationStructure() ?? {};

    return {
      index: 0,
      ...ruOrganisation,
      organisationName: ruOrganisationDetails.name,
      registrationNumber: ruOrganisationDetails.registrationNumber,
      classificationCodesDetails: {
        areSameAsRU: false,
        codes: {
          type: ruOrganisationDetails.type,
          otherTypeName: ruOrganisationDetails.otherTypeName,
          codes: ruOrganisationDetails.codes,
        },
      },
    };
  }

  removeOrganisationClicked(index: number) {
    this.removeOrganisation.emit(index);
  }
}

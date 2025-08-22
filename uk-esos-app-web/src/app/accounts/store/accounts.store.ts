import { Injectable } from '@angular/core';

import { Store } from '@core/store/store';
import { Paging } from '@shared/interfaces';

import { OrganisationAccountDTO, OrganisationAccountSearchResultsInfoDTO } from 'esos-api';

import { AccountsState, initialState } from './accounts.state';

@Injectable()
export class AccountsStore extends Store<AccountsState> {
  constructor() {
    super(initialState);
  }

  setSearchTerm(searchTerm: string) {
    this.setState({ ...this.getState(), searchTerm });
  }

  setSearchErrorSummaryVisible(searchErrorSummaryVisible: boolean) {
    this.setState({ ...this.getState(), searchErrorSummaryVisible });
  }

  setAccounts(accounts: OrganisationAccountSearchResultsInfoDTO[]) {
    this.setState({ ...this.getState(), accounts });
  }

  setTotal(total: number) {
    this.setState({ ...this.getState(), total });
  }

  setPaging(paging: Paging) {
    this.setState({ ...this.getState(), paging });
  }

  setSelectedAccount(selectedAccount: OrganisationAccountDTO) {
    this.setState({ ...this.getState(), selectedAccount });
  }
}

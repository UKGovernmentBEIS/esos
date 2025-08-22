import { OrganisationAccountDTO, OrganisationAccountSearchResultsInfoDTO } from 'esos-api';

export type AccountSearchResult = OrganisationAccountSearchResultsInfoDTO;
export type AccountStatus = OrganisationAccountSearchResultsInfoDTO['status'];

export interface AccountsState {
  searchTerm: string;
  searchErrorSummaryVisible: boolean;
  accounts: AccountSearchResult[];
  total: number;
  paging: {
    page: number;
    pageSize: number;
  };
  selectedAccount?: OrganisationAccountDTO;
}

export const initialState: AccountsState = {
  searchTerm: null,
  searchErrorSummaryVisible: false,
  accounts: [],
  total: 0,
  paging: {
    page: 1,
    pageSize: 30,
  },
  selectedAccount: undefined,
};

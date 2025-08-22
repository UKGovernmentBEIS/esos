export interface OperatorsColumn {
  name: string;
  roleName: string;
  authorityStatus: string;
  deleteBtn: string;
}

export interface OperatorRecord {
  userId: string;
  firstName: string;
  lastName: string;
  roleCode: string;
  roleName: string;
  authorityStatus: 'ACTIVE' | 'DISABLED' | 'PENDING';
  locked: boolean;
}

export type ContactType = 'PRIMARY' | 'SECONDARY';

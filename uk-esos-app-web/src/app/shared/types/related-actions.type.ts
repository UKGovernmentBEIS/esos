import { Permissions, TextLinkItem } from '@shared/interfaces';

export type RelatedActions = {
  [K in keyof Permissions]: Partial<{
    [L in Permissions[K]]: TextLinkItem;
  }>;
};

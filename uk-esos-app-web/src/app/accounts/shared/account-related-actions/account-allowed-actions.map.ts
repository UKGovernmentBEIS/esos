import { Permissions, TextLinkItem } from '@shared/interfaces';
import { RelatedActions } from '@shared/types';

export const accountRelatedActions: RelatedActions = {
  MANAGE_VERIFIED_ORGANISATION_ACCOUNTS: {
    EXECUTE: {
      text: 'Upload file with verified organisation accounts',
      link: ['upload-organisation-accounts'],
    },
  },
};

/**
 * Maps permissions to related actions and returns TextLinkItems[],
 * ready to be used in esos-account-related-actions component
 */
export const mapAccountPermissionsToActions = (permissions: Permissions): TextLinkItem[] => {
  const actions = [];
  for (const permission in permissions) {
    const permissionKey = permission;
    const permissionAction = permissions?.[permission];
    const textLinkItem = accountRelatedActions?.[permissionKey]?.[permissionAction];
    if (textLinkItem) {
      actions.push(textLinkItem);
    }
  }
  return actions;
};

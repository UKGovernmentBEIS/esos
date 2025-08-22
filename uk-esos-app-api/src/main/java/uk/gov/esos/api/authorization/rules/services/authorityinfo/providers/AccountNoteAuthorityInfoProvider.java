package uk.gov.esos.api.authorization.rules.services.authorityinfo.providers;

import uk.gov.esos.api.authorization.rules.services.authorityinfo.dto.AccountNoteAuthorityInfoDTO;

public interface AccountNoteAuthorityInfoProvider {

    AccountNoteAuthorityInfoDTO getAccountNoteAuthorityInfo(Long id);
}

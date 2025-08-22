package uk.gov.esos.api.authorization.rules.services.authorityinfo.providers;

import uk.gov.esos.api.authorization.rules.services.authorityinfo.dto.RequestAuthorityInfoDTO;
import uk.gov.esos.api.common.domain.enumeration.RoleType;

public interface RequestNoteAuthorityInfoProvider {

    RequestAuthorityInfoDTO getRequestNoteInfo(Long id, RoleType roleType);
}

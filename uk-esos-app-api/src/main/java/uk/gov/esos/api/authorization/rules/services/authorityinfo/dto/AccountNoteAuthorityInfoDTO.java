package uk.gov.esos.api.authorization.rules.services.authorityinfo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AccountNoteAuthorityInfoDTO {

    private String resourceSubType;

    private ResourceAuthorityInfo authorityInfo;
}

package uk.gov.esos.api.reporting.progressupdate.common.domain;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupChange {

    @Size(max = 255)
    private String otherResponsibleUndertakingName;

    @Size(max = 255)
    private String otherResponsibleUndertakingCrn;
}

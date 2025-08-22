package uk.gov.esos.api.reporting.noc.phase3.domain.organisationstructure;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.ClassificationCodes;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#areSameAsRU) == (#codes == null)}", message = "noc.organisationStructure.codes")
public class ClassificationCodesDetails {

    @NotNull
    private Boolean areSameAsRU;

    @Valid
    private ClassificationCodes codes;
}

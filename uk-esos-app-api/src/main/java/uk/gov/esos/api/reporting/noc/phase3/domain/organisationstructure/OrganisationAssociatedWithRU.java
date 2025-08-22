package uk.gov.esos.api.reporting.noc.phase3.domain.organisationstructure;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#registrationNumberExist) == (#registrationNumber != null)}", message = "noc.organisationStructure.registrationNumberExist")
@SpELExpression(expression = "{(T(java.lang.Boolean).FALSE.equals(#isParentOfResponsibleUndertaking)) || " +
        "(T(java.lang.Boolean).TRUE.equals(#isParentOfResponsibleUndertaking) == T(java.lang.Boolean).FALSE.equals(#isSubsidiaryOfResponsibleUndertaking))}",
        message = "noc.organisationStructure.isParentOfResponsibleUndertaking")
public class OrganisationAssociatedWithRU {

    @NotNull
    private Boolean registrationNumberExist;

    @Pattern(regexp = "^(?:\\d{8}|[A-Z]\\d{7}|[A-Z]{2}\\d{5}[A-Z0-9])$", message = "{noc.organisationStructure.registrationNumber}")
    private String registrationNumber;

    @NotBlank
    @Size(max = 255)
    private String organisationName;

    @NotNull
    private Boolean isPartOfArrangement;

    @NotNull
    private Boolean isParentOfResponsibleUndertaking;

    @NotNull
    private Boolean isSubsidiaryOfResponsibleUndertaking;

    @NotNull
    private Boolean isPartOfFranchise;

    @NotNull
    private Boolean hasCeasedToBePartOfGroup;

    @Valid
    @NotNull
    private ClassificationCodesDetails classificationCodesDetails;
}

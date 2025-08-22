package uk.gov.esos.api.reporting.noc.phase3.domain.confirmations;

import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;
import uk.gov.esos.api.reporting.noc.phase3.domain.ContactPerson;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Section;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "{#responsibleOfficerDetails?.jobTitle != null && !(#responsibleOfficerDetails?.jobTitle.trim().isEmpty())}",
        message = "noc.confirmations.responsibleOfficerDetails.jobtitle")
@SpELExpression(expression = "{(#secondResponsibleOfficerDetails == null) || (#secondResponsibleOfficerDetails?.jobTitle != null && " +
        "!(#secondResponsibleOfficerDetails?.jobTitle.trim().isEmpty()))}",
        message = "noc.confirmations.secondResponsibleOfficerDetails.jobtitle")
@SpELExpression(expression = "{(#secondResponsibleOfficerDetails == null) || !(#secondResponsibleOfficerDetails.email.equalsIgnoreCase(#responsibleOfficerDetails.email))}",
        message = "noc.confirmations.secondResponsibleOfficerDetails.email")
@SpELExpression(expression = "{(#reviewAssessmentDate == null) || " +
        "T(java.time.LocalDate).parse(#reviewAssessmentDate).isAfter(T(java.time.LocalDate).of(2019, 12, 5))}",
        message = "noc.confirmations.reviewAssessmentDate")
public class Confirmations implements NocP3Section {

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @Builder.Default
    private Set<ResponsibilityAssessmentType> responsibilityAssessmentTypes = new HashSet<>();

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @Builder.Default
    private Set<NoEnergyResponsibilityAssessmentType> noEnergyResponsibilityAssessmentTypes = new HashSet<>();

    @Valid
    @NotNull
    private ContactPerson responsibleOfficerDetails;

    private LocalDate reviewAssessmentDate;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @Builder.Default
    private Set<ResponsibilityAssessmentType> secondResponsibleOfficerEnergyTypes = new HashSet<>();

    @Valid
    private ContactPerson secondResponsibleOfficerDetails;
}

package uk.gov.esos.api.reporting.noc.phase3.domain.organisationstructure;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Section;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "{T(java.lang.Boolean).TRUE.equals(#isNonComplyingUndertakingsIncluded) == (#organisationUndertakingDetails?.size() gt 0)}", message = "noc.organisationStructure.isNonComplyingUndertakingsIncluded")
public class OrganisationStructure implements NocP3Section {

	@NotNull
	private Boolean isHighestParent;
	
	@NotNull
	private Boolean isNonComplyingUndertakingsIncluded;

	@Valid
	@Builder.Default
	@JsonInclude(JsonInclude.Include.NON_EMPTY)
	@JsonDeserialize(as = LinkedHashSet.class)
	Set<OrganisationUndertakingDetails> organisationUndertakingDetails = new HashSet<>();

	@Valid
    @Builder.Default
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
	@JsonDeserialize(as = LinkedHashSet.class)
	private Set<OrganisationAssociatedWithRU> organisationsAssociatedWithRU = new LinkedHashSet<>();

	@NotNull
	private Boolean isGroupStructureChartProvided;
}

package uk.gov.esos.api.reporting.noc.phase3.domain.complianceroute;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnergyAudit {

	@NotBlank
    @Size(max = 10000)
	private String description;
	
	@PositiveOrZero
	private Integer numberOfSitesCovered;
	
	@NotNull
	@PositiveOrZero
	private Integer numberOfSitesVisited;
	
	@NotBlank
    @Size(max = 10000)
	private String reason;
}

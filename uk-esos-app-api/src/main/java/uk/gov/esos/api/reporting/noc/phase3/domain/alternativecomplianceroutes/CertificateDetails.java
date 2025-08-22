package uk.gov.esos.api.reporting.noc.phase3.domain.alternativecomplianceroutes;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.common.domain.dto.validation.SpELExpression;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SpELExpression(expression = "{(#certificateNumber != null && #validFrom != null && #validUntil != null) || " +
	    "(#certificateNumber == null && #validFrom == null && #validUntil == null)}",
	    message = "noc.alternativecomplianceroutes.certificate.details.completed")
@SpELExpression(expression = "{(#validFrom == null) || (#validUntil == null) || " +
	    "T(java.time.LocalDate).parse(#validUntil).isAfter(T(java.time.LocalDate).parse(#validFrom))}",
	    message = "noc.alternativecomplianceroutes.certificate.date")
@SpELExpression(expression = "{(#validUntil == null) || " +
		"T(java.time.LocalDate).parse(#validUntil).isAfter(T(java.time.LocalDate).of(2023, 12, 4))}",
		message = "noc.alternativecomplianceroutes.certificate.details.validUntil")
@SpELExpression(expression = "{(#validFrom == null) || " +
		"T(java.time.LocalDate).parse(#validFrom).isBefore(T(java.time.LocalDate).of(2024, 6, 6))}",
		message = "noc.alternativecomplianceroutes.certificate.details.validFrom")
public class CertificateDetails {

	@Size(max = 10000)
	private String certificateNumber;

	private LocalDate validFrom;
	
	private LocalDate validUntil;
}

package uk.gov.esos.api.common.domain;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
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
@SpELExpression(expression = "{(#type eq 'OTHER') == (#otherTypeName != null)}", message = "classification.codes.otherTypeName")
public class ClassificationCodes {

	@NotNull
	private ClassificationType type;
	
	@Size(max = 255)
	private String otherTypeName;
	
	@NotEmpty
	@Size(min = 1, max = 4)
	private List<@Size(max = 255) String> codes;
}

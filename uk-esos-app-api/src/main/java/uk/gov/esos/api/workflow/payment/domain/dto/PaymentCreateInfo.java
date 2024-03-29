package uk.gov.esos.api.workflow.payment.domain.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentCreateInfo {

    private BigDecimal amount;
    private String paymentRefNum;
    private String description;
    private String returnUrl;
    private CompetentAuthorityEnum competentAuthority;
}

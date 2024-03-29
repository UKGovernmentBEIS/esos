package uk.gov.esos.api.workflow.payment.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentGetResult {

    private String paymentId;
    private PaymentStateInfo state;
    private String nextUrl;
}

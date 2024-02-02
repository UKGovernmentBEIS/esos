package uk.gov.esos.api.workflow.payment.service;

import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.workflow.payment.domain.PaymentMethod;
import uk.gov.esos.api.workflow.payment.domain.enumeration.PaymentMethodType;
import uk.gov.esos.api.workflow.payment.repository.PaymentMethodRepository;

@Service
@RequiredArgsConstructor
public class PaymentMethodService {

    private final PaymentMethodRepository paymentMethodRepository;

    public Set<PaymentMethodType> getPaymentMethodTypesByCa(CompetentAuthorityEnum competentAuthority) {
        return paymentMethodRepository.findByCompetentAuthority(competentAuthority).stream()
            .map(PaymentMethod::getType)
            .collect(Collectors.toSet());
    }
}

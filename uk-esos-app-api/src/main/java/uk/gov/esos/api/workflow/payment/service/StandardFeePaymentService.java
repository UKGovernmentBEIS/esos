package uk.gov.esos.api.workflow.payment.service;

import org.springframework.stereotype.Service;
import uk.gov.esos.api.workflow.payment.domain.enumeration.FeeMethodType;
import uk.gov.esos.api.workflow.payment.domain.enumeration.FeeType;
import uk.gov.esos.api.workflow.payment.repository.PaymentFeeMethodRepository;
import uk.gov.esos.api.workflow.request.core.domain.Request;

@Service
public class StandardFeePaymentService extends PaymentService {

    public StandardFeePaymentService(
        PaymentFeeMethodRepository paymentFeeMethodRepository) {
        super(paymentFeeMethodRepository);
    }

    @Override
    public FeeMethodType getFeeMethodType() {
        return FeeMethodType.STANDARD;
    }

    @Override
    public FeeType resolveFeeType(Request request) {
        return FeeType.FIXED;
    }
}

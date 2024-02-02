package uk.gov.esos.api.workflow.payment.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.workflow.payment.domain.PaymentFeeMethod;
import uk.gov.esos.api.workflow.payment.domain.enumeration.FeeMethodType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;

@Repository
public interface PaymentFeeMethodRepository extends JpaRepository<PaymentFeeMethod, Long> {

    @Transactional(readOnly = true)
    Optional<PaymentFeeMethod> findByCompetentAuthorityAndRequestType(CompetentAuthorityEnum competentAuthority,
                                                                      RequestType requestType);

    @Transactional(readOnly = true)
    Optional<PaymentFeeMethod> findByCompetentAuthorityAndRequestTypeAndType(CompetentAuthorityEnum competentAuthority,
                                                                             RequestType requestType, FeeMethodType feeMethodType);

}

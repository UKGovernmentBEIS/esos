package uk.gov.esos.api.workflow.request.flow.esos.noc.phase3.common.validation;

import org.springframework.stereotype.Service;

import uk.gov.esos.api.account.domain.enumeration.AccountStatus;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.authorization.rules.services.resource.AccountAuthorizationResourceService;
import uk.gov.esos.api.workflow.request.core.domain.dto.RequestDetailsDTO;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestCreateActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestStatus;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.core.service.RequestQueryService;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestCreateRequestTypeValidationResult;
import uk.gov.esos.api.workflow.request.flow.common.service.RequestCreateValidatorService;
import uk.gov.esos.api.workflow.request.flow.esos.noc.common.validation.RequestCreateNocRelatedValidator;

import java.util.Set;

@Service
public class NotificationOfComplianceP3ReInitiateValidator extends RequestCreateNocRelatedValidator {

    public NotificationOfComplianceP3ReInitiateValidator(final RequestCreateValidatorService requestCreateValidatorService,
                                  final RequestQueryService requestQueryService,
                                  final AccountAuthorizationResourceService accountAuthorizationResourceService) {
        super(requestCreateValidatorService, accountAuthorizationResourceService, requestQueryService);
    }

    @Override
    public RequestCreateActionType getType() {
        return RequestCreateActionType.RE_INITIATE_NOTIFICATION_OF_COMPLIANCE_P3;
    }

    @Override
    protected RequestCreateRequestTypeValidationResult validateRequestType(Long accountId, RequestDetailsDTO requestDetailsDTO) {
        final RequestCreateRequestTypeValidationResult result = RequestCreateRequestTypeValidationResult.builder().valid(true).build();
        if (requestDetailsDTO.getRequestStatus() != RequestStatus.COMPLETED) {
            result.setValid(false);
            result.setReportedRequestTypes(Set.of(RequestType.NOTIFICATION_OF_COMPLIANCE_P3));
        }
        return result;
    }

    @Override
    protected Set<AccountStatus> getApplicableAccountStatuses() {
        return Set.of(OrganisationAccountStatus.LIVE);
    }

    @Override
    protected RequestType getReferableRequestType() {
        return RequestType.NOTIFICATION_OF_COMPLIANCE_P3;
    }
}

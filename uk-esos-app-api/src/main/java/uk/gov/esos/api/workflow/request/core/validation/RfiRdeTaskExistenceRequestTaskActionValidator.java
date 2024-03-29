package uk.gov.esos.api.workflow.request.core.validation;

import java.util.Set;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.workflow.request.core.domain.RequestTaskActionValidationResult;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskType;

@Service
public class RfiRdeTaskExistenceRequestTaskActionValidator extends RequestTaskActionConflictBasedAbstractValidator {

    @Override
    public Set<RequestTaskActionType> getTypes() {
        return RequestTaskActionType.getRfiRdeSubmissionTypes();
    }

    @Override
    public Set<RequestTaskType> getConflictingRequestTaskTypes() {
        return RequestTaskType.getRfiRdeWaitForResponseTypes();
    }

    @Override
    protected RequestTaskActionValidationResult.ErrorMessage getErrorMessage() {
        return RequestTaskActionValidationResult.ErrorMessage.RFI_RDE_ALREADY_EXISTS;
    }
}

package uk.gov.esos.api.workflow.request.flow.common.validation;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import uk.gov.esos.api.account.domain.dto.CaExternalContactDTO;
import uk.gov.esos.api.account.service.CaExternalContactService;
import uk.gov.esos.api.authorization.core.domain.AuthorityStatus;
import uk.gov.esos.api.authorization.core.domain.dto.UserAuthorityDTO;
import uk.gov.esos.api.authorization.operator.service.OperatorAuthorityQueryService;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.workflow.request.core.assignment.taskassign.service.RequestTaskAssignmentValidationService;
import uk.gov.esos.api.workflow.request.core.domain.RequestTask;

@Service
@RequiredArgsConstructor
public class WorkflowUsersValidator {

    private final OperatorAuthorityQueryService operatorAuthorityQueryService;
    private final CaExternalContactService caExternalContactService;
    private final RequestTaskAssignmentValidationService requestTaskAssignmentValidationService;


    public boolean areOperatorsValid(final Long accountId,
                                     final Set<String> operators,
                                     final AppUser pmrvUser) {
    	if(CollectionUtils.isEmpty(operators)) {
    		return true;
    	}
    	
        final List<String> allOperators = operatorAuthorityQueryService.getAccountAuthorities(pmrvUser, accountId)
            .getAuthorities()
            .stream()
            .filter(au -> au.getAuthorityStatus().equals(AuthorityStatus.ACTIVE))
            .map(UserAuthorityDTO::getUserId)
            .collect(Collectors.toList());
        return allOperators.containsAll(operators);
    }

    public boolean areExternalContactsValid(final Set<Long> externalContacts,
                                            final AppUser pmrvUser) {
    	if(CollectionUtils.isEmpty(externalContacts)) {
    		return true;
    	}
    	
        final Set<Long> allExternalContacts = caExternalContactService.getCaExternalContacts(pmrvUser)
            .getCaExternalContacts()
            .stream()
            .map(CaExternalContactDTO::getId).
            collect(Collectors.toSet());
        return allExternalContacts.containsAll(externalContacts);
    }

    public boolean isSignatoryValid(final RequestTask requestTask,
                                     final String signatory) {
    	if(signatory == null) {
    		return true;
    	}
    	
        return requestTaskAssignmentValidationService.hasUserPermissionsToBeAssignedToTask(requestTask, signatory);
    }
}

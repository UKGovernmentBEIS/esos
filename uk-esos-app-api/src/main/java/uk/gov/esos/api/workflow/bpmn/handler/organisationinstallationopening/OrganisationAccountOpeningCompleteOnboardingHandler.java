package uk.gov.esos.api.workflow.bpmn.handler.organisationinstallationopening;

import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;
import uk.gov.esos.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.submit.service.OrganisationAccountOpeningCompleteOnboardingService;

@Component
@RequiredArgsConstructor
public class OrganisationAccountOpeningCompleteOnboardingHandler implements JavaDelegate {

    private final OrganisationAccountOpeningCompleteOnboardingService organisationAccountOpeningCompleteOnboardingService;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        organisationAccountOpeningCompleteOnboardingService.execute((String) execution.getVariable(BpmnProcessConstants.REQUEST_ID));
    }
}

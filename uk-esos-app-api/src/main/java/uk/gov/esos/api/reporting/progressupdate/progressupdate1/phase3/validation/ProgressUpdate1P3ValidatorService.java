package uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.validation;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountDTO;
import uk.gov.esos.api.account.organisation.service.OrganisationAccountQueryService;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.common.validation.ProgressUpdate1PhaseValidatorService;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3;
import uk.gov.esos.api.reporting.progressupdate.progressupdate1.phase3.domain.ProgressUpdate1P3Container;
import uk.gov.esos.api.reporting.progressupdate.common.domain.ProgressUpdateViolation;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflowperiod.service.WorkFlowValidPeriodService;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Validated
@Service
@RequiredArgsConstructor
public class ProgressUpdate1P3ValidatorService implements ProgressUpdate1PhaseValidatorService<ProgressUpdate1P3Container> {

    private final WorkFlowValidPeriodService workFlowValidPeriodService;
    private final OrganisationAccountQueryService organisationAccountQueryService;

    private final Validator validator;

    @Override
    public void validate(ProgressUpdate1P3Container pu1Container, Long accountId, boolean isDisaggregateUndertaking) {
        List<ProgressUpdateViolation> pu1Violations = new ArrayList<>();
        //validate the submission date
        if (!workFlowValidPeriodService.isValidSubmitDate(RequestType.PROGRESS_UPDATE_1_P3)) {
            throw new BusinessException(ErrorCode.PROGRESS_UPDATE_INVALID_SUBMIT_DATE);
        }

        validateDisaggregateUndertakings(pu1Container, accountId, pu1Violations, isDisaggregateUndertaking);

        Set<ConstraintViolation<ProgressUpdate1P3Container>> pu1Validations = validator.validate(pu1Container);
        if (!pu1Validations.isEmpty()) {
            pu1Violations.add(getPu1Violation(ProgressUpdate1P3.class.getName(), pu1Validations));
        }

        if (ObjectUtils.isNotEmpty(pu1Violations)) {
            throw new BusinessException(ErrorCode.INVALID_PROGRESS_UPDATE_1, pu1Violations);
        }

    }

    @Override
    public Phase getPhase() {
        return Phase.PHASE_3;
    }

    private ProgressUpdateViolation getPu1Violation(String section, Set<ConstraintViolation<ProgressUpdate1P3Container>> constraintViolations) {
        return new ProgressUpdateViolation(
                section,
                ProgressUpdateViolation.ProgressUpdateViolationMessage.INVALID_SECTION_DATA,
                constructViolationData(constraintViolations));
    }

    /**
     * Gathers all the violations messages to a list of string
     *
     * @param constraintViolations violations
     * @return List<String>
     */
    private List<String> constructViolationData(Set<ConstraintViolation<ProgressUpdate1P3Container>> constraintViolations) {
        List<String> violationData = new ArrayList<>();

        constraintViolations.forEach(constraintViolation ->
                violationData.add(String.format("%s - %s", constraintViolation.getPropertyPath(), constraintViolation.getMessage()))
        );

        return violationData;
    }

    private void validateDisaggregateUndertakings(ProgressUpdate1P3Container pu1Container, Long accountId, List<ProgressUpdateViolation> pu1Violations, boolean isDisaggregateUndertaking) {

        if (pu1Container.getProgressUpdate1P3().getGroupChange() != null) {
        	if (isDisaggregateUndertaking) {
                validateNameCrn(pu1Container, accountId, pu1Violations);
            } else {
            	validateGroupChange(pu1Container, pu1Violations);
            }
        }
    }

    private void validateNameCrn(ProgressUpdate1P3Container pu1Container, Long accountId,
			List<ProgressUpdateViolation> pu1Violations) {
		
		String crn = pu1Container.getProgressUpdate1P3().getGroupChange().getOtherResponsibleUndertakingCrn();
		String orgName = pu1Container.getProgressUpdate1P3().getGroupChange().getOtherResponsibleUndertakingName();
		OrganisationAccountDTO dto = organisationAccountQueryService.getOrganisationAccountDTOById(accountId);

		if ((crn != null && crn.equals(dto.getRegistrationNumber())) || (orgName != null && orgName.equals(dto.getName()))) {
		    pu1Violations.add(new ProgressUpdateViolation(ProgressUpdate1P3.class.getName(), ProgressUpdateViolation.ProgressUpdateViolationMessage.INVALID_PROGRESS_UPDATE_NAME_OR_CRN));
		}
	}

    /**
     * if it is not disaggregated account, the group change crn and name
     * must be null
     * @param pu1Container
     * @param pu1Violations
     */
    private void validateGroupChange(ProgressUpdate1P3Container pu1Container, List<ProgressUpdateViolation> pu1Violations) {
        if (pu1Container.getProgressUpdate1P3().getGroupChange().getOtherResponsibleUndertakingCrn() != null || 
        		pu1Container.getProgressUpdate1P3().getGroupChange().getOtherResponsibleUndertakingName() != null) {
            pu1Violations.add(new ProgressUpdateViolation(ProgressUpdate1P3.class.getName(), ProgressUpdateViolation.ProgressUpdateViolationMessage.INVALID_GROUP_CHANGE));
        }
    }
}

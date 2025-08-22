package uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.validation;

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
import uk.gov.esos.api.reporting.progressupdate.common.domain.ProgressUpdateViolation;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.common.validation.ProgressUpdate2PhaseValidatorService;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3;
import uk.gov.esos.api.reporting.progressupdate.progressupdate2.phase3.domain.ProgressUpdate2P3Container;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflowperiod.service.WorkFlowValidPeriodService;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Validated
@Service
@RequiredArgsConstructor
public class ProgressUpdate2P3ValidatorService implements ProgressUpdate2PhaseValidatorService<ProgressUpdate2P3Container> {

    private final WorkFlowValidPeriodService workFlowValidPeriodService;
    private final OrganisationAccountQueryService organisationAccountQueryService;

    private final Validator validator;

    public void validate(ProgressUpdate2P3Container pu2Container, Long accountId, boolean isDisaggregateUndertaking) {
        List<ProgressUpdateViolation> puViolations = new ArrayList<>();

        if (!workFlowValidPeriodService.isValidSubmitDate(RequestType.PROGRESS_UPDATE_2_P3)) {
            throw new BusinessException(ErrorCode.PROGRESS_UPDATE_INVALID_SUBMIT_DATE);
        }

        validateDisaggregateUndertakings(pu2Container, accountId, puViolations, isDisaggregateUndertaking);

        Set<ConstraintViolation<ProgressUpdate2P3Container>> puValidations = validator.validate(pu2Container);
        if (!puValidations.isEmpty()) {
            puViolations.add(getPu2Violation(ProgressUpdate2P3.class.getName(), puValidations));
        }

        if (ObjectUtils.isNotEmpty(puViolations)) {
            throw new BusinessException(ErrorCode.INVALID_PROGRESS_UPDATE_2, puViolations);
        }

    }

    @Override
    public Phase getPhase() {
        return Phase.PHASE_3;
    }

    private ProgressUpdateViolation getPu2Violation(String section, Set<ConstraintViolation<ProgressUpdate2P3Container>> constraintViolations) {
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
    private List<String> constructViolationData(Set<ConstraintViolation<ProgressUpdate2P3Container>> constraintViolations) {
        List<String> violationData = new ArrayList<>();

        constraintViolations.forEach(constraintViolation ->
                violationData.add(String.format("%s - %s", constraintViolation.getPropertyPath(), constraintViolation.getMessage()))
        );

        return violationData;
    }

    private void validateDisaggregateUndertakings(ProgressUpdate2P3Container pu2Container, Long accountId, List<ProgressUpdateViolation> puViolations, boolean isDisaggregateUndertaking) {

        if (pu2Container.getProgressUpdate2P3().getGroupChange() != null) {
            if (isDisaggregateUndertaking) {
                validateNameCrn(pu2Container, accountId, puViolations);
            } else {
                validateGroupChange(pu2Container, puViolations);
            }
        }
    }

    private void validateNameCrn(ProgressUpdate2P3Container pu2Container, Long accountId,
                                 List<ProgressUpdateViolation> puViolations) {

        String crn = pu2Container.getProgressUpdate2P3().getGroupChange().getOtherResponsibleUndertakingCrn();
        String orgName = pu2Container.getProgressUpdate2P3().getGroupChange().getOtherResponsibleUndertakingName();
        OrganisationAccountDTO dto = organisationAccountQueryService.getOrganisationAccountDTOById(accountId);

        if ((crn != null && crn.equals(dto.getRegistrationNumber())) || (orgName != null && orgName.equals(dto.getName()))) {
            puViolations.add(new ProgressUpdateViolation(ProgressUpdate2P3.class.getName(), ProgressUpdateViolation.ProgressUpdateViolationMessage.INVALID_PROGRESS_UPDATE_NAME_OR_CRN));
        }
    }

    private void validateGroupChange(ProgressUpdate2P3Container pu2Container, List<ProgressUpdateViolation> puViolations) {
        if (pu2Container.getProgressUpdate2P3().getGroupChange().getOtherResponsibleUndertakingCrn() != null ||
                pu2Container.getProgressUpdate2P3().getGroupChange().getOtherResponsibleUndertakingName() != null) {
            puViolations.add(new ProgressUpdateViolation(ProgressUpdate2P3.class.getName(), ProgressUpdateViolation.ProgressUpdateViolationMessage.INVALID_GROUP_CHANGE));
        }
    }
}

package uk.gov.esos.api.reporting.noc.phase3.validation;

import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.reporting.noc.common.domain.NocValidationResult;
import uk.gov.esos.api.reporting.noc.common.validation.NocPhaseValidatorService;
import uk.gov.esos.api.reporting.noc.common.validation.NocValidatorHelper;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.ReportingObligationCategory;
import uk.gov.esos.api.reporting.noc.phase3.service.NocP3ReportingObligationCategoryDeterminationService;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflowperiod.service.WorkFlowValidPeriodService;

import java.util.ArrayList;
import java.util.List;

@Validated
@Service
@RequiredArgsConstructor
public class NocP3ValidatorService implements NocPhaseValidatorService<NocP3Container> {

    private final NocP3ReportingObligationCategoryDeterminationService reportingObligationCategoryDeterminationService;
    private final List<NocP3SectionContextValidator> nocP3SectionContextValidators;
    private final WorkFlowValidPeriodService workFlowValidPeriodService;

    @Override
    public void validate(@NotNull NocP3Container nocContainer) {
        List<NocValidationResult> nocValidationResults = new ArrayList<>();

        // Determine reporting obligation category
        ReportingObligationCategory reportingObligationCategory = reportingObligationCategoryDeterminationService
            .determineReportingObligationCategory(nocContainer.getNoc().getReportingObligation());

        // Perform validations
        nocP3SectionContextValidators.forEach(v -> nocValidationResults.add(v.validate(nocContainer, reportingObligationCategory)));
        boolean isValid = nocValidationResults.stream().allMatch(NocValidationResult::isValid);

        if (!workFlowValidPeriodService.isValidSubmitDate(RequestType.NOTIFICATION_OF_COMPLIANCE_P3)) {
            throw new BusinessException(ErrorCode.NOC_INVALID_SUBMIT_DATE);
        }

        if(!isValid) {
            throw new BusinessException(ErrorCode.INVALID_NOC, NocValidatorHelper.extractViolations(nocValidationResults));
        }
    }

    @Override
    public Phase getPhase() {
        return Phase.PHASE_3;
    }
}

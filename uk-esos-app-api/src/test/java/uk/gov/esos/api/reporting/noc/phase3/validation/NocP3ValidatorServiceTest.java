package uk.gov.esos.api.reporting.noc.phase3.validation;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.reporting.common.domain.Phase;
import uk.gov.esos.api.reporting.noc.common.domain.NocValidationResult;
import uk.gov.esos.api.reporting.noc.common.domain.NocViolation;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3;
import uk.gov.esos.api.reporting.noc.phase3.domain.NocP3Container;
import uk.gov.esos.api.reporting.noc.phase3.domain.ReportingObligationCategory;
import uk.gov.esos.api.reporting.noc.phase3.domain.reportingobligation.ReportingObligation;
import uk.gov.esos.api.reporting.noc.phase3.service.NocP3ReportingObligationCategoryDeterminationService;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflowperiod.service.WorkFlowValidPeriodService;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NocP3ValidatorServiceTest {

    @InjectMocks
    private NocP3ValidatorService nocP3ValidatorService;

    @Mock
    private NocP3ReportingObligationCategoryDeterminationService reportingObligationCategoryDeterminationService;

    @Spy
    private ArrayList<NocP3SectionContextValidator> contextValidators;

    @Mock
    private TestNocP3SectionContextValidator testSectionContextValidator;

    @Mock
    private WorkFlowValidPeriodService workFlowValidPeriodService;

    @BeforeEach
    void setUp() {
        contextValidators.add(testSectionContextValidator);
        nocP3ValidatorService = new NocP3ValidatorService(reportingObligationCategoryDeterminationService, contextValidators,workFlowValidPeriodService);
    }

    @Test
    void validate_valid() {
        ReportingObligationCategory reportingObligationCategory = ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100;
        ReportingObligation reportingObligation = ReportingObligation.builder().build();
        NocP3Container nocP3Container = NocP3Container.builder()
            .phase(Phase.PHASE_3)
            .noc(NocP3.builder().reportingObligation(reportingObligation).build())
            .build();

        when(reportingObligationCategoryDeterminationService.determineReportingObligationCategory(reportingObligation))
            .thenReturn(reportingObligationCategory);
        when(testSectionContextValidator.validate(nocP3Container, reportingObligationCategory))
            .thenReturn(NocValidationResult.validNoc());

        when(workFlowValidPeriodService.isValidSubmitDate(RequestType.NOTIFICATION_OF_COMPLIANCE_P3)).thenReturn(true);


        nocP3ValidatorService.validate(nocP3Container);

        verify(reportingObligationCategoryDeterminationService, times(1))
            .determineReportingObligationCategory(reportingObligation);
        verify(testSectionContextValidator, times(1)).validate(nocP3Container, reportingObligationCategory);
    }

    @Test
    void validate_invalid() {
        ReportingObligationCategory reportingObligationCategory = ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100;
        ReportingObligation reportingObligation = ReportingObligation.builder().build();
        NocP3Container nocP3Container = NocP3Container.builder()
            .phase(Phase.PHASE_3)
            .noc(NocP3.builder().reportingObligation(reportingObligation).build())
            .build();

        NocViolation nocViolation = new NocViolation("section", NocViolation.NocViolationMessage.INVALID_SECTION);

        when(reportingObligationCategoryDeterminationService.determineReportingObligationCategory(reportingObligation))
            .thenReturn(reportingObligationCategory);
        when(testSectionContextValidator.validate(nocP3Container, reportingObligationCategory))
            .thenReturn(NocValidationResult.invalidNoc(List.of(nocViolation)));

        when(workFlowValidPeriodService.isValidSubmitDate(RequestType.NOTIFICATION_OF_COMPLIANCE_P3)).thenReturn(true);

        BusinessException be = assertThrows(BusinessException.class, () -> nocP3ValidatorService.validate(nocP3Container));

        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.INVALID_NOC);

        verify(reportingObligationCategoryDeterminationService, times(1))
            .determineReportingObligationCategory(reportingObligation);
        verify(testSectionContextValidator, times(1)).validate(nocP3Container, reportingObligationCategory);
    }

    @Test
    void validNocSbmDate(){
        ReportingObligationCategory reportingObligationCategory = ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100;
        ReportingObligation reportingObligation = ReportingObligation.builder().build();
        NocP3Container nocP3Container = NocP3Container.builder()
                .phase(Phase.PHASE_3)
                .noc(NocP3.builder().reportingObligation(reportingObligation).build())
                .build();

        when(reportingObligationCategoryDeterminationService.determineReportingObligationCategory(reportingObligation))
                .thenReturn(reportingObligationCategory);
        when(testSectionContextValidator.validate(nocP3Container, reportingObligationCategory))
                .thenReturn(NocValidationResult.validNoc());

        when(workFlowValidPeriodService.isValidSubmitDate(RequestType.NOTIFICATION_OF_COMPLIANCE_P3)).thenReturn(true);

        nocP3ValidatorService.validate(nocP3Container);

        verify(reportingObligationCategoryDeterminationService, times(1))
                .determineReportingObligationCategory(reportingObligation);
        verify(testSectionContextValidator, times(1)).validate(nocP3Container, reportingObligationCategory);
    }

    @Test
    void validate_invalid_Sbm_Date() {
        ReportingObligationCategory reportingObligationCategory = ReportingObligationCategory.ESOS_ENERGY_ASSESSMENTS_95_TO_100;
        ReportingObligation reportingObligation = ReportingObligation.builder().build();
        NocP3Container nocP3Container = NocP3Container.builder()
                .phase(Phase.PHASE_3)
                .noc(NocP3.builder().reportingObligation(reportingObligation).build())
                .build();

        when(reportingObligationCategoryDeterminationService.determineReportingObligationCategory(reportingObligation))
                .thenReturn(reportingObligationCategory);
        when(testSectionContextValidator.validate(nocP3Container, reportingObligationCategory))
                .thenReturn(NocValidationResult.validNoc());

        when(workFlowValidPeriodService.isValidSubmitDate(RequestType.NOTIFICATION_OF_COMPLIANCE_P3)).thenReturn(false);

        BusinessException be = assertThrows(BusinessException.class, () -> nocP3ValidatorService.validate(nocP3Container));

        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.NOC_INVALID_SUBMIT_DATE);

        verify(reportingObligationCategoryDeterminationService, times(1))
                .determineReportingObligationCategory(reportingObligation);
        verify(testSectionContextValidator, times(1)).validate(nocP3Container, reportingObligationCategory);
    }

    @Test
    void getPhase() {
        assertEquals(Phase.PHASE_3, nocP3ValidatorService.getPhase());
    }

    private static class TestNocP3SectionContextValidator implements NocP3SectionContextValidator {
        @Override
        public NocValidationResult validate(NocP3Container nocContainer, ReportingObligationCategory reportingObligationCategory) {
            return null;
        }
    }
}
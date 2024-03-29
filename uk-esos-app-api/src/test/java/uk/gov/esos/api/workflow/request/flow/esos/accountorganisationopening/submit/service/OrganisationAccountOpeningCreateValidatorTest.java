package uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.submit.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestCreateActionType;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestCreateValidationResult;
import uk.gov.esos.api.workflow.request.flow.esos.accountorganisationopening.submit.service.OrganisationAccountOpeningCreateValidator;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class OrganisationAccountOpeningCreateValidatorTest {

    @InjectMocks
    private OrganisationAccountOpeningCreateValidator validator;
    
    @Test
    void validateAction_valid() {
        RequestCreateValidationResult result = validator.validateAction(null);
        
        assertThat(result.isValid()).isTrue();
        assertThat(result.getReportedRequestTypes()).isEmpty();
        assertThat(result.getReportedAccountStatus()).isNull();
    }
    
    @Test
    void validateAction_invalid() {
        Long accountId = 1L;

        RequestCreateValidationResult result = validator.validateAction(accountId);
        
        assertThat(result.isValid()).isFalse();
        assertThat(result.getReportedRequestTypes()).isEmpty();
        assertThat(result.getReportedAccountStatus()).isNull();
    }

    @Test
    void getType() {
        assertThat(validator.getType())
                .isEqualTo(RequestCreateActionType.ORGANISATION_ACCOUNT_OPENING_SUBMIT_APPLICATION);
    }
}

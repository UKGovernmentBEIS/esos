package uk.gov.esos.api.verificationbody.domain.dto.validation;

import uk.gov.esos.api.verificationbody.enumeration.VerificationBodyStatus;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class StatusPendingValidator implements ConstraintValidator<StatusPending, VerificationBodyStatus> {

    @Override
    public boolean isValid(VerificationBodyStatus status, ConstraintValidatorContext context) {
        return !VerificationBodyStatus.PENDING.equals(status);
    }
}

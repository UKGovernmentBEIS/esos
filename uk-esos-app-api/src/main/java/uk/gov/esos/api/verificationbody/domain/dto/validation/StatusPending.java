package uk.gov.esos.api.verificationbody.domain.dto.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = StatusPendingValidator.class)
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface StatusPending {

    String message() default "Status cannot be updated to Pending";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}

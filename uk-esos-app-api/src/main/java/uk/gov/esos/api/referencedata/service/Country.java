package uk.gov.esos.api.referencedata.service;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * The annotation for country name validation.
 */
@Constraint(validatedBy = CountryValidator.class)
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface Country {

    String message() default "Invalid country name";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}

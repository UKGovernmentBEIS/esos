package uk.gov.esos.api.common.domain.dto;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import uk.gov.esos.api.common.domain.ClassificationCodes;
import uk.gov.esos.api.common.domain.ClassificationType;

class ClassificationCodesTest {

	private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_other_codes_valid() {
    	ClassificationCodes codes = ClassificationCodes.builder()
    			.type(ClassificationType.OTHER)
    			.otherTypeName("NACE")
    			.codes(List.of("code1", "code2", "code3", "code4"))
            .build();

        final Set<ConstraintViolation<ClassificationCodes>> violations = validator.validate(codes);

        assertThat(violations).isEmpty();
    }
    
    @Test
    void validate_sic_codes_valid() {
    	ClassificationCodes codes = ClassificationCodes.builder()
    			.type(ClassificationType.SIC)
    			.codes(List.of("code1"))
            .build();

        final Set<ConstraintViolation<ClassificationCodes>> violations = validator.validate(codes);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_other_codes_name_not_exist_invalid() {
    	ClassificationCodes codes = ClassificationCodes.builder()
    			.type(ClassificationType.OTHER)
    			.codes(List.of("code1"))
            .build();

        final Set<ConstraintViolation<ClassificationCodes>> violations = validator.validate(codes);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
        	.containsExactly("{classification.codes.otherTypeName}");
    }
    
    @Test
    void validate_codes_more_than_four_invalid() {
    	ClassificationCodes codes = ClassificationCodes.builder()
    			.type(ClassificationType.SIC)
    			.codes(List.of("code1", "code2", "code3", "code4", "code5"))
            .build();

        final Set<ConstraintViolation<ClassificationCodes>> violations = validator.validate(codes);

        assertThat(violations).isNotEmpty();
        assertThat(violations).extracting(ConstraintViolation::getMessage)
        	.containsExactly("size must be between 1 and 4");
    }
}

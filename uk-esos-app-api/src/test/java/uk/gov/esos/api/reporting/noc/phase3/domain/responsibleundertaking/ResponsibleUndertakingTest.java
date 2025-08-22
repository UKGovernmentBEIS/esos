package uk.gov.esos.api.reporting.noc.phase3.domain.responsibleundertaking;

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
import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;
import uk.gov.esos.api.common.domain.dto.PhoneNumberDTO;

class ResponsibleUndertakingTest {

	private Validator validator;

    @BeforeEach
    void setup() {
        try (ValidatorFactory factory = Validation.buildDefaultValidatorFactory()) {
            validator = factory.getValidator();
        }
    }

    @Test
    void validate_when_flags_true_valid() {
    	ResponsibleUndertaking responsibleUndertaking = ResponsibleUndertaking.builder()
                .organisationDetails(buildOrganisationDetails())
                .tradingDetails(buildTradingDetails())
                .organisationContactDetails(buildOrganisationContactDetails())
                .isBehalfOfTrust(Boolean.TRUE)
                .trustName("Trust name")
                .hasOverseasParentDetails(Boolean.TRUE)
                .overseasParentDetails(OverseasParentDetails.builder().name("name").build())
                .build();

        final Set<ConstraintViolation<ResponsibleUndertaking>> violations = validator.validate(responsibleUndertaking);

        assertThat(violations).isEmpty();
    }

	@Test
    void validate_when_flags_false_valid() {
		ResponsibleUndertaking responsibleUndertaking = ResponsibleUndertaking.builder()
                .organisationDetails(buildOrganisationDetails())
                .tradingDetails(buildTradingDetails())
                .organisationContactDetails(buildOrganisationContactDetails())
                .isBehalfOfTrust(Boolean.FALSE)
                .hasOverseasParentDetails(Boolean.FALSE)
                .build();

        final Set<ConstraintViolation<ResponsibleUndertaking>> violations = validator.validate(responsibleUndertaking);

        assertThat(violations).isEmpty();
    }

    @Test
    void validate_when_flags_true_dependencies_not_exist_invalid() {
    	ResponsibleUndertaking responsibleUndertaking = ResponsibleUndertaking.builder()
                .organisationDetails(buildOrganisationDetails())
                .tradingDetails(buildTradingDetails())
                .organisationContactDetails(buildOrganisationContactDetails())
                .isBehalfOfTrust(Boolean.TRUE)
                .hasOverseasParentDetails(Boolean.TRUE)
                .build();

        final Set<ConstraintViolation<ResponsibleUndertaking>> violations = validator.validate(responsibleUndertaking);

            assertThat(violations).isNotEmpty();
            assertThat(violations).extracting(ConstraintViolation::getMessage)
            	.containsExactlyInAnyOrder(
            			"{noc.responsibleUndertaking.hasOverseasParentDetails}");
    }

	@Test
	void validate_when_other_classification_type_valid() {
		ReviewOrganisationDetails reviewOrganisationDetails = buildOrganisationDetails();
		reviewOrganisationDetails.setCodes(ClassificationCodes.builder()
						.type(ClassificationType.OTHER)
						.otherTypeName("other type name")
						.codes(List.of("code 1", "code 2"))
				.build());
		ResponsibleUndertaking responsibleUndertaking = ResponsibleUndertaking.builder()
				.organisationDetails(reviewOrganisationDetails)
				.tradingDetails(buildTradingDetails())
				.organisationContactDetails(buildOrganisationContactDetails())
				.isBehalfOfTrust(Boolean.TRUE)
				.trustName("Trust name")
				.hasOverseasParentDetails(Boolean.TRUE)
				.overseasParentDetails(OverseasParentDetails.builder().name("name").build())
				.build();

		final Set<ConstraintViolation<ResponsibleUndertaking>> violations = validator.validate(responsibleUndertaking);

		assertThat(violations).isEmpty();
	}
    
    private OrganisationContactDetails buildOrganisationContactDetails() {
		return OrganisationContactDetails.builder()
	            .email("mail@mail.com")
	            .phoneNumber(PhoneNumberDTO.builder().countryCode("30").number("123").build())
	            .build();
	}

	private TradingDetails buildTradingDetails() {
		return TradingDetails.builder().exist(Boolean.FALSE).build();
	}

	private ReviewOrganisationDetails buildOrganisationDetails() {
		return ReviewOrganisationDetails.builder()
	            .name("organisationName")
	            .registrationNumberExist(Boolean.TRUE)
	            .registrationNumber("registrationNumber")
	            .address(CountyAddressDTO.builder().line1("line1").city("city").county("county").postcode("code").build())
				.codes(buildClassificationCodes())
	            .build();
	}

	private ClassificationCodes buildClassificationCodes() {
		return ClassificationCodes.builder()
				.type(ClassificationType.SIC)
				.codes(List.of("code1", "code2"))
				.build();
	}
}

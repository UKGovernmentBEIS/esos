package uk.gov.esos.api.reporting.noc.common.validation;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import uk.gov.esos.api.common.domain.ClassificationCodes;
import uk.gov.esos.api.common.domain.ClassificationType;
import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;
import uk.gov.esos.api.common.domain.dto.PhoneNumberDTO;
import uk.gov.esos.api.reporting.noc.common.domain.NocViolation;
import uk.gov.esos.api.reporting.noc.phase3.domain.responsibleundertaking.OrganisationContactDetails;
import uk.gov.esos.api.reporting.noc.phase3.domain.responsibleundertaking.ResponsibleUndertaking;
import uk.gov.esos.api.reporting.noc.phase3.domain.responsibleundertaking.ReviewOrganisationDetails;
import uk.gov.esos.api.reporting.noc.phase3.domain.responsibleundertaking.TradingDetails;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

class NocSectionConstraintValidatorServiceTest {

    private NocSectionConstraintValidatorService nocSectionConstraintValidatorService;

    private Validator validator;

    @BeforeEach
    public void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
        nocSectionConstraintValidatorService = new NocSectionConstraintValidatorService(validator);
    }

    @Test
    void validate_valid() {
        ReviewOrganisationDetails reviewOrganisationDetails = ReviewOrganisationDetails.builder()
            .name("organisationName")
            .registrationNumberExist(Boolean.TRUE)
            .registrationNumber("registrationNumber")
            .address(CountyAddressDTO.builder().line1("line1").city("city").county("county").postcode("code").build())
            .codes(ClassificationCodes.builder()
                    .type(ClassificationType.SIC)
                    .codes(List.of("code 1"))
                    .build())
            .build();
        TradingDetails tradingDetails = TradingDetails.builder().exist(Boolean.FALSE).build();
        OrganisationContactDetails organisationContactDetails = OrganisationContactDetails.builder()
            .email("mail@mail.com")
            .phoneNumber(PhoneNumberDTO.builder().countryCode("30").number("123").build())
            .build();
        ResponsibleUndertaking responsibleUndertaking = ResponsibleUndertaking.builder()
            .organisationDetails(reviewOrganisationDetails)
            .tradingDetails(tradingDetails)
            .organisationContactDetails(organisationContactDetails)
            .isBehalfOfTrust(Boolean.TRUE)
            .trustName("Trust name")
            .hasOverseasParentDetails(Boolean.FALSE)
            .build();

        //invoke
        Optional<NocViolation> result = nocSectionConstraintValidatorService.validate(responsibleUndertaking);

        //verify
        assertThat(result).isEmpty();
    }

    @Test
    void validate_invalid() {
        ReviewOrganisationDetails reviewOrganisationDetails = ReviewOrganisationDetails.builder()
            .name("organisationName")
            .registrationNumber("registrationNumber")
            .address(CountyAddressDTO.builder().line1("line1").city("city").county("county").postcode("code").build())
            .build();
        TradingDetails tradingDetails = TradingDetails.builder().exist(Boolean.FALSE).build();
        OrganisationContactDetails organisationContactDetails = OrganisationContactDetails.builder()
            .email("mail")
            .phoneNumber(PhoneNumberDTO.builder().countryCode("GR").number("123").build())
            .build();
        ResponsibleUndertaking responsibleUndertaking = ResponsibleUndertaking.builder()
            .organisationDetails(reviewOrganisationDetails)
            .tradingDetails(tradingDetails)
            .organisationContactDetails(organisationContactDetails)
            .hasOverseasParentDetails(Boolean.TRUE)
            .build();

        //invoke
        Optional<NocViolation> result = nocSectionConstraintValidatorService.validate(responsibleUndertaking);

        //verify
        assertThat(result).isPresent();
    }
}
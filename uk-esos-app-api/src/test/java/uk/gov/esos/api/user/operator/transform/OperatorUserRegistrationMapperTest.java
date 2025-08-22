package uk.gov.esos.api.user.operator.transform;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.keycloak.representations.idm.UserRepresentation;
import org.mapstruct.factory.Mappers;
import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;
import uk.gov.esos.api.common.domain.dto.PhoneNumberDTO;
import uk.gov.esos.api.user.core.domain.enumeration.KeycloakUserAttributes;
import uk.gov.esos.api.user.operator.domain.OperatorUserRegistrationDTO;

import static org.assertj.core.api.Assertions.assertThat;

class OperatorUserRegistrationMapperTest {

    private OperatorUserRegistrationMapper mapper;

    @BeforeEach
    void init() {
        mapper = Mappers.getMapper(OperatorUserRegistrationMapper.class);
    }
    
	@Test
	void toUserRepresentation() {
		String fn = "fn";
		String ln = "ln";
		String line1 = "line1";
		String city = "city";
		String country = "GR";
		String postCode = "post";
		OperatorUserRegistrationDTO
            userRegistrationDTO = createOperatorUserRegistrationDTO(fn, ln, line1, null, city, country, postCode);
		
		//invoke
		UserRepresentation userRepresentation = 
				mapper.toUserRepresentation(userRegistrationDTO, "email@email");
		
		//assert
		assertThat(userRepresentation.getFirstName()).isEqualTo(fn);
		assertThat(userRepresentation.getLastName()).isEqualTo(ln);
		assertThat(userRepresentation.getAttributes().get(KeycloakUserAttributes.LINE_1.getName()).get(0)).isEqualTo(line1);
		assertThat(userRepresentation.getAttributes().get(KeycloakUserAttributes.LINE_2.getName())).isNull();
		assertThat(userRepresentation.getAttributes().get(KeycloakUserAttributes.CITY.getName()).get(0)).isEqualTo(city);
		assertThat(userRepresentation.getAttributes().get(KeycloakUserAttributes.COUNTY.getName()).get(0)).isEqualTo(country);
		assertThat(userRepresentation.getAttributes().get(KeycloakUserAttributes.POSTCODE.getName()).get(0)).isEqualTo(postCode);
		assertThat(userRepresentation.getEmail()).isEqualTo("email@email");
	}

	private OperatorUserRegistrationDTO createOperatorUserRegistrationDTO(
			String firstName, String lastName,
			String line1, String line2, String city, String county, String postCode) {
		return OperatorUserRegistrationDTO.builder()
				.firstName(firstName)
				.lastName(lastName)
				.phoneNumber(PhoneNumberDTO.builder().countryCode("GR").number("123").build())
				.address(CountyAddressDTO.builder().line1(line1).line2(line2).city(city).county(county).postcode(postCode).build())
				.termsVersion(Short.valueOf((short)1))
				.build();
	}

}

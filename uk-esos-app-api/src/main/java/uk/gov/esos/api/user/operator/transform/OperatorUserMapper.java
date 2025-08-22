package uk.gov.esos.api.user.operator.transform;

import org.keycloak.representations.idm.UserRepresentation;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import org.springframework.util.ObjectUtils;
import uk.gov.esos.api.common.domain.dto.CountyAddressDTO;
import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.common.domain.dto.PhoneNumberDTO;
import uk.gov.esos.api.user.core.domain.enumeration.AuthenticationStatus;
import uk.gov.esos.api.user.core.domain.enumeration.KeycloakUserAttributes;
import uk.gov.esos.api.user.operator.domain.OperatorUserDTO;
import uk.gov.esos.api.user.operator.domain.OperatorUserInvitationDTO;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * The Operator Mapper.
 */
@Mapper(componentModel = "spring", config = MapperConfig.class, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface OperatorUserMapper {

    @Mapping(target = "email", source = "username")
    OperatorUserDTO toOperatorUserDTO(UserRepresentation userRepresentation);

    @AfterMapping
    default void populateAttributeToOperatorUserDTO(UserRepresentation userRepresentation, @MappingTarget OperatorUserDTO operatorUserDTO) {
        if(ObjectUtils.isEmpty(userRepresentation.getAttributes())) {
            return;
        }

        Optional.ofNullable(userRepresentation.getAttributes().get(KeycloakUserAttributes.USER_STATUS.getName()))
                .ifPresent(list -> operatorUserDTO.setStatus(AuthenticationStatus.valueOf(list.get(0))));

        /* Set Address */
        CountyAddressDTO addressDTO = new CountyAddressDTO();
        Optional.ofNullable(userRepresentation.getAttributes().get(KeycloakUserAttributes.LINE_1.getName()))
                .ifPresent(list -> addressDTO.setLine1(ObjectUtils.isEmpty(list) ? null : list.get(0)));
        Optional.ofNullable(userRepresentation.getAttributes().get(KeycloakUserAttributes.LINE_2.getName()))
                .ifPresent(list -> addressDTO.setLine2(ObjectUtils.isEmpty(list) ? null : list.get(0)));
        Optional.ofNullable(userRepresentation.getAttributes().get(KeycloakUserAttributes.CITY.getName()))
                .ifPresent(list -> addressDTO.setCity(ObjectUtils.isEmpty(list) ? null : list.get(0)));
        Optional.ofNullable(userRepresentation.getAttributes().get(KeycloakUserAttributes.COUNTY.getName()))
                .ifPresent(list -> addressDTO.setCounty(ObjectUtils.isEmpty(list) ? null : list.get(0)));
        Optional.ofNullable(userRepresentation.getAttributes().get(KeycloakUserAttributes.POSTCODE.getName()))
                .ifPresent(list -> addressDTO.setPostcode(ObjectUtils.isEmpty(list) ? null : list.get(0)));
        operatorUserDTO.setAddress(addressDTO);

        /* Set phone number */
        PhoneNumberDTO phoneNumber = new PhoneNumberDTO();
        Optional.ofNullable(userRepresentation.getAttributes().get(KeycloakUserAttributes.PHONE_NUMBER_CODE.getName()))
                .ifPresent(list -> phoneNumber.setCountryCode(ObjectUtils.isEmpty(list) ? null : list.get(0)));
        Optional.ofNullable(userRepresentation.getAttributes().get(KeycloakUserAttributes.PHONE_NUMBER.getName()))
                .ifPresent(list -> phoneNumber.setNumber(ObjectUtils.isEmpty(list) ? null : list.get(0)));
        operatorUserDTO.setPhoneNumber(phoneNumber);

        /* Set Mobile number */
        PhoneNumberDTO mobileNumber = new PhoneNumberDTO();
        Optional.ofNullable(userRepresentation.getAttributes().get(KeycloakUserAttributes.MOBILE_NUMBER_CODE.getName()))
                .ifPresent(list -> mobileNumber.setCountryCode(ObjectUtils.isEmpty(list) ? null : list.get(0)));
        Optional.ofNullable(userRepresentation.getAttributes().get(KeycloakUserAttributes.MOBILE_NUMBER.getName()))
                .ifPresent(list -> mobileNumber.setNumber(ObjectUtils.isEmpty(list) ? null : list.get(0)));
        operatorUserDTO.setMobileNumber(mobileNumber);

        Optional.ofNullable(userRepresentation.getAttributes().get(KeycloakUserAttributes.TERMS_VERSION.getName()))
                .ifPresent(list -> operatorUserDTO.setTermsVersion(ObjectUtils.isEmpty(list) ? null : Short.valueOf(list.get(0))));

        Optional.ofNullable(userRepresentation.getAttributes().get(KeycloakUserAttributes.JOB_TITLE.getName()))
            .ifPresent(list -> operatorUserDTO.setJobTitle(ObjectUtils.isEmpty(list) ? null : list.get(0)));
    }

    @Mapping(target = "id", source = "userId")
    @Mapping(target = "firstName", source = "operatorUserDTO.firstName")
    @Mapping(target = "lastName", source = "operatorUserDTO.lastName")
    @Mapping(target = "email", source = "email")
    UserRepresentation toUserRepresentation(OperatorUserDTO operatorUserDTO, String userId, String username, String email, Map<String, List<String>> attributes);

    @AfterMapping
    default void populateAttributesToUserRepresentation(OperatorUserDTO operatorUserDTO, @MappingTarget UserRepresentation userRepresentation) {

        // Set phone numbers
        userRepresentation.singleAttribute(KeycloakUserAttributes.PHONE_NUMBER_CODE.getName(),
                operatorUserDTO.getPhoneNumber().getCountryCode());
        userRepresentation.singleAttribute(KeycloakUserAttributes.PHONE_NUMBER.getName(),
                operatorUserDTO.getPhoneNumber().getNumber());

        Optional.ofNullable(operatorUserDTO.getMobileNumber()).ifPresentOrElse(phoneNumberDTO -> {
            userRepresentation.singleAttribute(KeycloakUserAttributes.MOBILE_NUMBER_CODE.getName(),
                    phoneNumberDTO.getCountryCode());
            userRepresentation.singleAttribute(KeycloakUserAttributes.MOBILE_NUMBER.getName(),
                    phoneNumberDTO.getNumber());
        }, () -> {
            userRepresentation.singleAttribute(KeycloakUserAttributes.MOBILE_NUMBER_CODE.getName(), null);
            userRepresentation.singleAttribute(KeycloakUserAttributes.MOBILE_NUMBER.getName(), null);
        });

        userRepresentation.singleAttribute(KeycloakUserAttributes.JOB_TITLE.getName(), operatorUserDTO.getJobTitle());

        // Set address
        CountyAddressDTO address = operatorUserDTO.getAddress();
        userRepresentation.singleAttribute(KeycloakUserAttributes.LINE_1.getName(), address.getLine1());
        userRepresentation.singleAttribute(KeycloakUserAttributes.LINE_2.getName(), address.getLine2());
        userRepresentation.singleAttribute(KeycloakUserAttributes.CITY.getName(), address.getCity());
        userRepresentation.singleAttribute(KeycloakUserAttributes.COUNTY.getName(), address.getCounty());
        userRepresentation.singleAttribute(KeycloakUserAttributes.POSTCODE.getName(), address.getPostcode());
    }

    @Mapping(target = "username", source = "email")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "firstName", source = "firstName")
    @Mapping(target = "lastName", source = "lastName")
    UserRepresentation toUserRepresentation(String email, String firstName, String lastName);
    
    @Mapping(target = "username", source = "operatorUserInvitation.email")
    @Mapping(target = "email", source = "operatorUserInvitation.email")
    @Mapping(target = "firstName", source = "operatorUserInvitation.firstName")
    @Mapping(target = "lastName", source = "operatorUserInvitation.lastName")
    @Mapping(target = "enabled", ignore = true)
    UserRepresentation toUserRepresentation(OperatorUserInvitationDTO operatorUserInvitation);
}

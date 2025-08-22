package uk.gov.esos.api.user.operator.transform;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import uk.gov.esos.api.authorization.core.domain.dto.AuthorityInfoDTO;
import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.user.operator.domain.OperatorUserAcceptInvitationDTO;
import uk.gov.esos.api.user.operator.domain.OperatorUserDTO;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface OperatorUserAcceptInvitationMapper {

	 @Mapping(target = "userAuthorityId", source = "authorityInfoDTO.id")
     @Mapping(target = "userAuthenticationStatus", source = "operatorUserDTO.status")
     @Mapping(target = "userId", source = "authorityInfoDTO.userId")
		OperatorUserAcceptInvitationDTO toOperatorUserAcceptInvitationDTO(OperatorUserDTO operatorUserDTO,
				AuthorityInfoDTO authorityInfoDTO, String accountInstallationName);
}

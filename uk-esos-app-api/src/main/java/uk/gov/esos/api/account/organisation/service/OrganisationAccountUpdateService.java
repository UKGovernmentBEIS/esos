package uk.gov.esos.api.account.organisation.service;

import java.util.List;

import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import uk.gov.esos.api.account.organisation.domain.ClassificationCode;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccount;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountUpdateDTO;
import uk.gov.esos.api.account.organisation.domain.transform.ClassificationCodesMapper;
import uk.gov.esos.api.account.service.validator.AccountStatus;
import uk.gov.esos.api.common.domain.transform.CountyAddressMapper;

@Service
@RequiredArgsConstructor
public class OrganisationAccountUpdateService {
	
	private final OrganisationAccountQueryService queryService;
	private static final CountyAddressMapper countyAddressMapper = Mappers.getMapper(CountyAddressMapper.class);

	@Transactional
    @AccountStatus(expression = "{#status == 'LIVE'}")
    public void updateOrganisationAccount(Long accountId, @Valid OrganisationAccountUpdateDTO accountUpdateDTO) {
        OrganisationAccount account = queryService.getAccountById(accountId);
        List<ClassificationCode> existingCodes = account.getClassificationCodes();

        account.setName(accountUpdateDTO.getName());
        account.setAddress(countyAddressMapper.toCountyAddress(accountUpdateDTO.getAddress()));
        // replace codes with the new ones
        existingCodes.clear();
        ClassificationCodesMapper.toClassificationCodeList(accountUpdateDTO.getCodes(), account).forEach(existingCodes::add);        
    }
}

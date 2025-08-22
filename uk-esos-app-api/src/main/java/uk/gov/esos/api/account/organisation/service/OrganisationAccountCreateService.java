package uk.gov.esos.api.account.organisation.service;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import uk.gov.esos.api.account.organisation.domain.OrganisationAccount;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccountStatus;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountDTO;
import uk.gov.esos.api.account.organisation.domain.transform.ClassificationCodesMapper;
import uk.gov.esos.api.account.organisation.repository.OrganisationAccountRepository;
import uk.gov.esos.api.account.organisation.transform.OrganisationAccountMapper;
import uk.gov.esos.api.account.organisation.utils.AccountOrganisationIdGenerator;
import uk.gov.esos.api.common.domain.enumeration.AccountType;

@Validated
@Service
@RequiredArgsConstructor
public class OrganisationAccountCreateService {

    private final OrganisationAccountValidationService organisationAccountValidationService;
    private final OrganisationAccountRepository organisationAccountRepository;
    private static final OrganisationAccountMapper organisationAccountMapper = Mappers.getMapper(OrganisationAccountMapper.class);

    public OrganisationAccountDTO createOrganisationAccount(@Valid OrganisationAccountDTO creationDTO) {
        organisationAccountValidationService.validateActiveAccountRegistrationNumberExistence(creationDTO.getRegistrationNumber());

        Long accountId = organisationAccountRepository.generateId();
        String organisationId = AccountOrganisationIdGenerator.generate(accountId);

        OrganisationAccount account =
            organisationAccountMapper.toOrganisationAccount(creationDTO, accountId,organisationId, AccountType.ORGANISATION, OrganisationAccountStatus.AWAITING_APPROVAL);
        account.setClassificationCodes(ClassificationCodesMapper.toClassificationCodeList(creationDTO.getCodes(), account));

        return organisationAccountMapper.toOrganisationAccountDTO(organisationAccountRepository.save(account));
    }
}

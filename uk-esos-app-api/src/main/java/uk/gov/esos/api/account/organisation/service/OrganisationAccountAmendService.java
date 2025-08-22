package uk.gov.esos.api.account.organisation.service;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import uk.gov.esos.api.account.organisation.domain.ClassificationCode;
import uk.gov.esos.api.account.organisation.domain.OrganisationAccount;
import uk.gov.esos.api.account.organisation.domain.dto.OrganisationAccountDTO;
import uk.gov.esos.api.account.organisation.domain.transform.ClassificationCodesMapper;
import uk.gov.esos.api.account.organisation.repository.OrganisationAccountRepository;
import uk.gov.esos.api.account.organisation.transform.OrganisationAccountMapper;

@Validated
@Service
@RequiredArgsConstructor
public class OrganisationAccountAmendService {

    private final OrganisationAccountQueryService organisationAccountQueryService;
    private final OrganisationAccountRepository organisationAccountRepository;
    private static final OrganisationAccountMapper ORGANISATION_ACCOUNT_MAPPER = Mappers.getMapper(OrganisationAccountMapper.class);

    @Transactional
    public void amendAccount(Long accountId, @Valid OrganisationAccountDTO updatedAccountDTO) {
        OrganisationAccount existingAccount = organisationAccountQueryService.getAccountById(accountId);
        List<ClassificationCode> existingCodes = existingAccount.getClassificationCodes();

        OrganisationAccount updatedAccount = ORGANISATION_ACCOUNT_MAPPER.toOrganisationAccount(updatedAccountDTO,
                existingAccount.getId(),
                existingAccount.getOrganisationId(),
                existingAccount.getAccountType(),
                existingAccount.getStatus()
            );
        // replace codes with the amended ones
        existingCodes.clear();
        updatedAccount.setClassificationCodes(ClassificationCodesMapper.toClassificationCodeList(updatedAccountDTO.getCodes(), updatedAccount));

        organisationAccountRepository.save(updatedAccount);
    } 
}

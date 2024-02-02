package uk.gov.esos.api.workflow.payment.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.workflow.payment.domain.dto.BankAccountDetailsDTO;
import uk.gov.esos.api.workflow.payment.repository.BankAccountDetailsRepository;
import uk.gov.esos.api.workflow.payment.transform.BankAccountDetailsMapper;

@Service
@RequiredArgsConstructor
public class BankAccountDetailsService {

    private final BankAccountDetailsRepository bankAccountDetailsRepository;
    private static final BankAccountDetailsMapper bankAccountDetailsMapper = Mappers.getMapper(BankAccountDetailsMapper.class);

    public BankAccountDetailsDTO getBankAccountDetailsByCa(CompetentAuthorityEnum competentAuthority) {
        return bankAccountDetailsRepository.findByCompetentAuthority(competentAuthority)
            .map(bankAccountDetailsMapper::toBankAccountDetailsDTO)
            .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
    }
}

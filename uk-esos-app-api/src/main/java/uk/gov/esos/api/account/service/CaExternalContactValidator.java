package uk.gov.esos.api.account.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.account.domain.dto.CaExternalContactRegistrationDTO;
import uk.gov.esos.api.account.repository.CaExternalContactRepository;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;

@Service
@RequiredArgsConstructor
public class CaExternalContactValidator {

    private final CaExternalContactRepository caExternalContactRepository;

    void validateCaExternalContactRegistration(CompetentAuthorityEnum ca,
                                                   CaExternalContactRegistrationDTO caExternalContactRegistration) {
        boolean caNameAlreadyExists = false;
        boolean caEmailAlreadyExists = false;
        if (caExternalContactRepository.existsByCompetentAuthorityAndName(ca, caExternalContactRegistration.getName()))
            caNameAlreadyExists = true;

        if (caExternalContactRepository.existsByCompetentAuthorityAndEmail(ca, caExternalContactRegistration.getEmail()))
            caEmailAlreadyExists = true;

        validateEmailAndName(caNameAlreadyExists, caEmailAlreadyExists);
    }

    void validateCaExternalContactRegistration(CompetentAuthorityEnum ca, Long id,
                                               CaExternalContactRegistrationDTO caExternalContactRegistration) {
        boolean caNameAlreadyExists = false;
        boolean caEmailAlreadyExists = false;
        if (caExternalContactRepository.existsByCompetentAuthorityAndNameAndIdNot(ca, caExternalContactRegistration.getName(), id))
            caNameAlreadyExists = true;

        if (caExternalContactRepository.existsByCompetentAuthorityAndEmailAndIdNot(ca, caExternalContactRegistration.getEmail(), id))
            caEmailAlreadyExists = true;

        validateEmailAndName(caNameAlreadyExists, caEmailAlreadyExists);
    }

    private void validateEmailAndName(boolean caNameAlreadyExists, boolean caEmailAlreadyExists) {
        if (caNameAlreadyExists && caEmailAlreadyExists)
            throw new BusinessException(ErrorCode.EXTERNAL_CONTACT_CA_NAME_EMAIL_ALREADY_EXISTS);

        if (caNameAlreadyExists)
            throw new BusinessException(ErrorCode.EXTERNAL_CONTACT_CA_NAME_ALREADY_EXISTS);

        if (caEmailAlreadyExists)
            throw new BusinessException(ErrorCode.EXTERNAL_CONTACT_CA_EMAIL_ALREADY_EXISTS);
    }
}

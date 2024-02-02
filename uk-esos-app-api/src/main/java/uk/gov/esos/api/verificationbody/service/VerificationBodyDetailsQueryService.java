package uk.gov.esos.api.verificationbody.service;

import lombok.RequiredArgsConstructor;

import org.mapstruct.factory.Mappers;

import org.springframework.stereotype.Service;

import uk.gov.esos.api.verificationbody.domain.verificationbodydetails.VerificationBodyDetails;
import uk.gov.esos.api.verificationbody.transform.VerificationBodyMapper;

@Service
@RequiredArgsConstructor
public class VerificationBodyDetailsQueryService {

    private final VerificationBodyQueryService verificationBodyQueryService;
    private static final VerificationBodyMapper verificationBodyMapper = Mappers
            .getMapper(VerificationBodyMapper.class);

    public VerificationBodyDetails getVerificationBodyDetails(Long vbId) {
        return verificationBodyMapper
                .toVerificationBodyDetails(verificationBodyQueryService.getVerificationBodyById(vbId));
    }
}

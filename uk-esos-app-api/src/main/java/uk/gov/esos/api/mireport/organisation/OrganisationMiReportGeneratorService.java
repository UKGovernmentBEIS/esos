package uk.gov.esos.api.mireport.organisation;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.common.domain.enumeration.AccountType;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.mireport.common.MiReportGeneratorService;
import uk.gov.esos.api.mireport.common.MiReportRepository;
import uk.gov.esos.api.mireport.common.MiReportType;
import uk.gov.esos.api.mireport.common.domain.dto.MiReportParams;
import uk.gov.esos.api.mireport.common.domain.dto.MiReportResult;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrganisationMiReportGeneratorService implements MiReportGeneratorService, InitializingBean {

    @PersistenceContext(unitName = "reportEa")
    private EntityManager reportEaEntityManager;

    @PersistenceContext(unitName = "reportSepa")
    private EntityManager reportSepaEntityManager;

    @PersistenceContext(unitName = "reportNiea")
    private EntityManager reportNieaEntityManager;

    @PersistenceContext(unitName = "reportOpred")
    private EntityManager reportOpredEntityManager;

    @PersistenceContext(unitName = "reportNrw")
    private EntityManager reportNrwEntityManager;

    private final MiReportRepository miReportRepository;

    private final List<OrganisationMiReportGeneratorHandler> organisationMiReportGeneratorHandlers;

    private Map<CompetentAuthorityEnum, EntityManager> caToEntityManagerMap = new EnumMap<>(CompetentAuthorityEnum.class);

    @Override
    public MiReportResult generateReport(CompetentAuthorityEnum competentAuthority, MiReportParams reportParams) {
        return organisationMiReportGeneratorHandlers.stream()
            .filter(generator -> isReportTypeFound(reportParams.getReportType(), generator))
            .findFirst()
            .filter(generator -> miReportRepository.findByCompetentAuthorityAndAccountType(competentAuthority, getAccountType())
                .stream()
                .anyMatch(miReportSearchResult -> miReportSearchResult.getMiReportType() == reportParams.getReportType()))
            .map(generator -> generator.generateMiReport(caToEntityManagerMap.get(competentAuthority), reportParams))
            .orElseThrow(() -> new BusinessException(ErrorCode.MI_REPORT_TYPE_NOT_SUPPORTED));
    }

    private boolean isReportTypeFound(MiReportType miReportType, OrganisationMiReportGeneratorHandler<MiReportParams> generator) {
        return generator.getReportType() == miReportType;
    }

    @Override
    public AccountType getAccountType() {
        return AccountType.ORGANISATION;
    }

    @Override
    public void afterPropertiesSet() {
        caToEntityManagerMap.put(CompetentAuthorityEnum.ENGLAND, reportEaEntityManager);
        caToEntityManagerMap.put(CompetentAuthorityEnum.SCOTLAND, reportSepaEntityManager);
        caToEntityManagerMap.put(CompetentAuthorityEnum.NORTHERN_IRELAND, reportNieaEntityManager);
        caToEntityManagerMap.put(CompetentAuthorityEnum.OPRED, reportOpredEntityManager);
        caToEntityManagerMap.put(CompetentAuthorityEnum.WALES, reportNrwEntityManager);
    }
}

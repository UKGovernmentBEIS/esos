package uk.gov.esos.api.workflowperiod.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.workflowperiod.domain.WorkFlowValidPeriod;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflowperiod.repository.WorkFlowValidPeriodRepository;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class WorkFlowValidPeriodService {

    private final WorkFlowValidPeriodRepository workFlowValidPeriodRepository;

    /**
     *  returns WorkFlowValidPeriod by given type
     * @param type RequestType
     * @return {@link WorkFlowValidPeriod}
     */
    public WorkFlowValidPeriod findWorkFlowValidPeriodByType(RequestType type){
        return workFlowValidPeriodRepository.findWorkFlowValidPeriodByType(type).
                orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
    }

    /**
     *  returns if workflow can start
     * @param type RequestType
     * @return true if valid or else false
     */
    public boolean isValidStartDate(RequestType type) {
        WorkFlowValidPeriod workFlowValidPeriod = findWorkFlowValidPeriodByType(type);
        return isValidDate(workFlowValidPeriod.getInitiateStartDate(), workFlowValidPeriod.getInitiateEndDate());
    }

    /**
     *  returns if workflow can be submitted
     * @param type RequestType
     * @return true if valid or else false
     */
    public boolean isValidSubmitDate(RequestType type) {
        WorkFlowValidPeriod workFlowValidPeriod = findWorkFlowValidPeriodByType(type);
        return isValidDate(workFlowValidPeriod.getSubmitStartDate(), workFlowValidPeriod.getSubmitEndDate());
    }

    /**
     *  validates if current date is between valid dates for start or submit request
     * @param startDate LocalDateTime
     * @param endDate LocalDateTime
     * @return true if valid or else false
     */
    public boolean isValidDate(LocalDateTime startDate, LocalDateTime endDate) {
        return (LocalDateTime.now().isEqual(startDate) || LocalDateTime.now().isAfter(startDate)) &&
                (LocalDateTime.now().isEqual(endDate) || LocalDateTime.now().isBefore(endDate));
    }

}



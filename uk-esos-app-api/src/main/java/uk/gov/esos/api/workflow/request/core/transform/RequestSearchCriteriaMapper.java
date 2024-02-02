package uk.gov.esos.api.workflow.request.core.transform;

import org.mapstruct.Mapper;

import uk.gov.esos.api.common.transform.MapperConfig;
import uk.gov.esos.api.workflow.request.core.domain.dto.RequestSearchByAccountCriteria;
import uk.gov.esos.api.workflow.request.core.domain.dto.RequestSearchCriteria;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface RequestSearchCriteriaMapper {
    
    RequestSearchCriteria toRequestSearchCriteria(RequestSearchByAccountCriteria requestSearchByAccountCriteria);
}

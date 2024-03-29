package uk.gov.esos.api.workflow.request.flow.common.service;

import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;

import java.util.Date;
import java.util.Optional;
import java.util.Set;

public interface CalculateApplicationReviewExpirationDateService {

    Optional<Date> expirationDate();

    Set<RequestType> getTypes();
}

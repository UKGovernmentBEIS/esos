package uk.gov.esos.api.workflow.request.core.service;

import java.util.Set;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.esos.api.workflow.request.core.domain.RequestTaskPayload;

@Service
@RequiredArgsConstructor
public class RequestTaskValidationService {

    private final Validator validator;

    public void validateRequestTaskPayload(RequestTaskPayload requestTaskPayload) {
        Set<ConstraintViolation<RequestTaskPayload>> violations = validator.validate(requestTaskPayload);
        if(!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }
    }
}

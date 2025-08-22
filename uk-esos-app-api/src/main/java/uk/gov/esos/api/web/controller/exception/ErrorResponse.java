package uk.gov.esos.api.web.controller.exception;

import lombok.Builder;
import lombok.Data;

/**
 * The ErrorResponse for all exceptions
 */
@Data
@Builder
public class ErrorResponse {

    /** The error code */
    private String code;

    /** The error message */
    private String message;

    /** Whether the error is security related */
    private Boolean security;

    /** The error message */
    private Object [] data;
}

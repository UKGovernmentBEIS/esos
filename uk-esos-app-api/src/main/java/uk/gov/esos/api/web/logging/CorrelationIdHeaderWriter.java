package uk.gov.esos.api.web.logging;

import org.springframework.security.web.header.HeaderWriter;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.UUID;

@Component
public class CorrelationIdHeaderWriter implements HeaderWriter {
    public static final String CORRELATION_ID_HEADER = "Correlation-Id";

    @Override
    public void writeHeaders(HttpServletRequest request, HttpServletResponse response) {
        if (!response.containsHeader(CORRELATION_ID_HEADER)) {
            response.addHeader(CORRELATION_ID_HEADER, UUID.randomUUID().toString());
        }
    }
}

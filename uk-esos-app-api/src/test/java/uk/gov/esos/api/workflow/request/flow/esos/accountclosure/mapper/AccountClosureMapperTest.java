package uk.gov.esos.api.workflow.request.flow.esos.accountclosure.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestActionPayloadType;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain.AccountClosureApplicationRequestActionPayload;
import uk.gov.esos.api.workflow.request.flow.esos.accountclosure.domain.AccountClosureRequestPayload;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class AccountClosureMapperTest {

    private AccountClosureMapper accountClosureMapper;

    @BeforeEach
    public void setUp() {
        accountClosureMapper = Mappers.getMapper(AccountClosureMapper.class);
    }



    @Test
    public void testToAccountClosureApplicationRequestActionPayload() {
        // Arrange
        AccountClosureRequestPayload requestPayload = new AccountClosureRequestPayload();
        RequestActionPayloadType payloadType = RequestActionPayloadType.ACCOUNT_CLOSURE_APPLICATION_SUBMITTED_PAYLOAD; // Replace with actual type if necessary

        // Act
        AccountClosureApplicationRequestActionPayload result = accountClosureMapper
                .toAccountClosureApplicationRequestActionPayload(requestPayload, payloadType);

        // Assert payloadType is mapped correctly
        assertEquals(payloadType, result.getPayloadType());

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime submitDate = result.getSubmitDate();
        long differenceInSeconds = ChronoUnit.SECONDS.between(submitDate, now);

        // Check that the difference is within an acceptable range (e.g., 1 second)
        assertTrue(differenceInSeconds <= 1, "submitDate should be within 1 second of the current time");
    }

}
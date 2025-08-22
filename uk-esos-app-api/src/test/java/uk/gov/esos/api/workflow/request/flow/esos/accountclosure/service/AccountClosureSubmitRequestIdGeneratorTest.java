package uk.gov.esos.api.workflow.request.flow.esos.accountclosure.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestParams;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class AccountClosureSubmitRequestIdGeneratorTest {

    @InjectMocks
    private AccountClosureSubmitRequestIdGenerator generator;

    @Test
    void generate() {
        RequestParams params = RequestParams.builder()
                .accountId(7903L)
                .build();

        String requestId = generator.generate(params);

        assertThat(requestId).isEqualTo("ACL007903");
    }


    @Test
    void getTypes() {
        assertThat(generator.getTypes()).containsExactly(RequestType.ACCOUNT_CLOSURE);
    }

    @Test
    void getPrefix() {
        assertThat(generator.getPrefix()).isEqualTo("ACL");
    }

}
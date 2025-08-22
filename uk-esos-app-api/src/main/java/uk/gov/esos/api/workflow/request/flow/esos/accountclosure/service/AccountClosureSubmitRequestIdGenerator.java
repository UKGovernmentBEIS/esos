package uk.gov.esos.api.workflow.request.flow.esos.accountclosure.service;

import org.springframework.stereotype.Service;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestType;
import uk.gov.esos.api.workflow.request.flow.common.domain.dto.RequestParams;
import uk.gov.esos.api.workflow.request.flow.common.service.RequestIdGenerator;

import java.util.List;

@Service
public class AccountClosureSubmitRequestIdGenerator implements RequestIdGenerator {
    @Override
    public String generate(RequestParams params) {
        Long accountId = params.getAccountId();
        return String.format("%s%06d", getPrefix(), accountId);
    }

    @Override
    public List<RequestType> getTypes() {
        return List.of(RequestType.ACCOUNT_CLOSURE);
    }

    /**
     *  Account closure prefix
     * @return ACL
     */
    @Override
    public String getPrefix() {
        return "ACL";
    }
}

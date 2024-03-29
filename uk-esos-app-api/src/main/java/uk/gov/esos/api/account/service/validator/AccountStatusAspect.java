package uk.gov.esos.api.account.service.validator;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.BooleanUtils;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import uk.gov.esos.api.account.domain.Account;
import uk.gov.esos.api.account.repository.AccountRepository;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.common.utils.SpELParser;

import java.lang.reflect.Method;

import static uk.gov.esos.api.common.exception.ErrorCode.RESOURCE_NOT_FOUND;

@Aspect
@Component
@RequiredArgsConstructor
public class AccountStatusAspect {

    private final AccountRepository accountRepository;

    @Before("@annotation(uk.gov.esos.api.account.service.validator.AccountStatus)")
    public void validateAccountStatus(JoinPoint joinPoint) {
        String expression = getExpression(joinPoint);
        Long accountId = (Long) joinPoint.getArgs()[0];
        // lock account:
        Account account = accountRepository.findByIdForUpdate(accountId)
            .orElseThrow(() -> new BusinessException(RESOURCE_NOT_FOUND));

        final Boolean valid = SpELParser.parseExpression(
            expression,
            new String[] {"status"},
            new Object[] {account.getStatus().getName()},
            Boolean.class);

        if (BooleanUtils.isFalse(valid)) {
            throw new BusinessException(ErrorCode.ACCOUNT_INVALID_STATUS);
        }
    }

    private String getExpression(JoinPoint joinPoint) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        return method.getAnnotation(AccountStatus.class).expression();
    }

}

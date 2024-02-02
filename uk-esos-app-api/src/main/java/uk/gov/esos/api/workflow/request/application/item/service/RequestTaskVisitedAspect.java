package uk.gov.esos.api.workflow.request.application.item.service;

import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import uk.gov.esos.api.authorization.core.domain.AppUser;

@Component
@Aspect
@RequiredArgsConstructor
public class RequestTaskVisitedAspect {

    private final RequestTaskVisitService requestTaskVisitService;

    @AfterReturning("execution(* uk.gov.esos.api.workflow.request.application.taskview.RequestTaskViewService.getTaskItemInfo(..))")
    void createRequestTaskVisitAfterGetTaskItemInfo(JoinPoint joinPoint) {
        Long taskId = (Long) joinPoint.getArgs()[0];
        AppUser pmrvUser = (AppUser) joinPoint.getArgs()[1];
        requestTaskVisitService.create(taskId, pmrvUser.getUserId());
    }
}

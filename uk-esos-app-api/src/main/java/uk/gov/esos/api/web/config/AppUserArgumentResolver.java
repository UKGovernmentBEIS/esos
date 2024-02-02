package uk.gov.esos.api.web.config;

import lombok.RequiredArgsConstructor;
import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.web.security.AppSecurityComponent;

@Component
@RequiredArgsConstructor
public class AppUserArgumentResolver implements HandlerMethodArgumentResolver {
    private final AppSecurityComponent appSecurityComponent;

    @Override
    public AppUser resolveArgument(MethodParameter methodParameter,
                                   ModelAndViewContainer modelViewContainer, NativeWebRequest nativeWebRequest,
                                   WebDataBinderFactory webDataBinderFactory) {
        return appSecurityComponent.getAuthenticatedUser();
    }

    @Override
    public boolean supportsParameter(MethodParameter methodParameter) {
        return methodParameter.getParameterType().equals(AppUser.class);
    }
}

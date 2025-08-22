package uk.gov.esos.api.web.security;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import uk.gov.esos.api.common.domain.enumeration.RoleType;

/**
 * Annotation for authorization based on the {@link RoleType}.
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface AuthorizedRole {

    /**
     * The permitted {@link RoleType}.
     */
    RoleType[] roleType();
    
    /**
     * Whether authorities existence is required (in general tr
     * @return
     */
    boolean authoritiesRequired() default true;
}

package uk.gov.esos.api.web.config.security;

import org.springframework.boot.autoconfigure.security.oauth2.resource.OAuth2ResourceServerProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import uk.gov.esos.api.authorization.core.service.AuthorityService;
import uk.gov.esos.api.authorization.core.service.UserRoleTypeService;
import uk.gov.esos.api.web.security.ApplicationAuthenticationConverter;
import uk.gov.esos.api.web.security.RoleTypeClaimConverter;

import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;

@Configuration
public class ApiSecurityConfig {

    private final AuthorityService authorityService;
    private final UserRoleTypeService userRoleTypeService;

    public ApiSecurityConfig(AuthorityService authorityService, UserRoleTypeService userRoleTypeService) {
        this.authorityService = authorityService;
        this.userRoleTypeService = userRoleTypeService;
    }

    @Bean
    @Order(2)
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .csrf().disable()
                .cors(Customizer.withDefaults())
                .headers(httpSecurityHeadersConfigurer -> httpSecurityHeadersConfigurer.httpStrictTransportSecurity().includeSubDomains(true))
                .authorizeHttpRequests(authorize -> authorize.requestMatchers(
                                antMatcher("/v1.0/verifier-users/registration/**"),
                                antMatcher("/v1.0/users/security-setup/2fa/delete*"),
                                antMatcher("/v1.0/users/forgot-password/**"),
                                antMatcher("/v1.0/file-attachments/**"),
                                antMatcher("/v1.0/file-document-templates/**"),
                                antMatcher("/v1.0/file-documents/**"),
                                antMatcher("/v1.0/file-notes/**"),
                                antMatcher("/v1.0/users/token/**"),
                                antMatcher("/v1.0/user-signatures/**"),
                                antMatcher("/v1.0/data/**"),
                                antMatcher("/v3/api-docs/**"),
                                antMatcher("/error"),
                                antMatcher("/swagger-ui/**"),
                                antMatcher("/swagger-resources/**"),
                                antMatcher("/configuration/**"),
                                antMatcher("/ui-configuration/**"),
                                antMatcher("/webjars/**"),
                                antMatcher("/actuator/**"))
                        .permitAll())
                .authorizeHttpRequests(authorize -> authorize.requestMatchers(antMatcher("/**"))
                        .authenticated())
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt()
                        .jwtAuthenticationConverter(new ApplicationAuthenticationConverter(authorityService)));
        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder(OAuth2ResourceServerProperties properties) {
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withJwkSetUri(
                properties.getJwt().getJwkSetUri()).build();

        jwtDecoder.setClaimSetConverter(new RoleTypeClaimConverter(userRoleTypeService));
        return jwtDecoder;
    }
}

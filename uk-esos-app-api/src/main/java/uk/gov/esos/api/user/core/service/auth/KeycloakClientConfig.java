package uk.gov.esos.api.user.core.service.auth;

import lombok.RequiredArgsConstructor;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import uk.gov.esos.api.common.config.KeycloakProperties;

@Configuration
@RequiredArgsConstructor
public class KeycloakClientConfig {

    @Bean
    public Keycloak keycloakAdminClient(KeycloakProperties keycloakProperties) {
        return KeycloakBuilder.builder()
                .serverUrl(keycloakProperties.getAuthServerUrl())
                .grantType(OAuth2Constants.CLIENT_CREDENTIALS)
                .realm(keycloakProperties.getRealm())
                .clientId(keycloakProperties.getClientId())
                .clientSecret(keycloakProperties.getClientSecret())
                .build();
    }
}

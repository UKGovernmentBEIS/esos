package gov.uk.esos.keycloak.onelogin.broker.themeresources;

import org.keycloak.Config;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.theme.PropertiesUtil;
import org.keycloak.theme.ResourceLoader;
import org.keycloak.theme.ThemeResourceProvider;
import org.keycloak.theme.ThemeResourceProviderFactory;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Locale;
import java.util.Properties;

import static org.keycloak.theme.ClasspathThemeResourceProviderFactory.THEME_RESOURCES_MESSAGES;
import static org.keycloak.theme.ClasspathThemeResourceProviderFactory.THEME_RESOURCES_TEMPLATES;
import static org.keycloak.theme.ClasspathThemeResourceProviderFactory.THEME_RESOURCES_RESOURCES;

public class OneLoginIdpThemeResourceProvider implements ThemeResourceProvider, ThemeResourceProviderFactory {
    public static final String PROVIDER_ID = "ol-theme-resource-provider";
    private static final String THEME_RESOURCES_EMAIL = THEME_RESOURCES_TEMPLATES + "email/";

    private final ClassLoader classLoader;

    public OneLoginIdpThemeResourceProvider() {
        this.classLoader = Thread.currentThread().getContextClassLoader();
    }

    @Override
    public URL getTemplate(String name) throws IOException {
        URL resourceUrl = classLoader.getResource(THEME_RESOURCES_TEMPLATES + name);
        if (resourceUrl == null) {
            resourceUrl = classLoader.getResource(THEME_RESOURCES_EMAIL + name);
        }

        return resourceUrl;
    }

    @Override
    public InputStream getResourceAsStream(String path) throws IOException {
        return ResourceLoader.getResourceAsStream(THEME_RESOURCES_RESOURCES, path);
    }

    @Override
    public Properties getMessages(String baseBundlename, Locale locale) throws IOException {
        Properties messages = new Properties();
        URL resource = this.classLoader.getResource(THEME_RESOURCES_MESSAGES + baseBundlename + "_" + locale.toString() + ".properties");
        loadMessages(messages, resource);
        return messages;
    }

    @Override
    public void close() {
        // NOT NEEDED
    }

    @Override
    public ThemeResourceProvider create(KeycloakSession session) {
        return this;
    }

    @Override
    public void init(Config.Scope config) {
        // NOT NEEDED
    }

    @Override
    public void postInit(KeycloakSessionFactory factory) {
        // NOT NEEDED
    }

    @Override
    public String getId() {
        return PROVIDER_ID;
    }

    private void loadMessages(Properties messages, URL resource) throws IOException {
        if (resource != null) {
            try (InputStream stream = resource.openStream()) {
                PropertiesUtil.readCharsetAware(messages, stream);
            }
        }
    }
}

package uk.gov.esos.api.common.config.cloudwatch;

import io.micrometer.cloudwatch2.CloudWatchConfig;
import io.micrometer.cloudwatch2.CloudWatchMeterRegistry;
import io.micrometer.core.aop.TimedAspect;
import io.micrometer.core.instrument.Clock;
import io.micrometer.core.instrument.Meter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.config.MeterFilter;
import io.micrometer.core.instrument.distribution.DistributionStatisticConfig;
import io.micrometer.observation.ObservationRegistry;
import jakarta.servlet.DispatcherType;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.filter.ServerHttpObservationFilter;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cloudwatch.CloudWatchAsyncClient;

import java.net.URI;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
public class MetricsConfig {
    private final CloudWatchProperties properties;

    /**
     * Actual CloudWatch async client for aws env.
     */
    @Bean
    public CloudWatchAsyncClient cloudWatchAsyncClient() {
        return CloudWatchAsyncClient.builder()
                .region(Region.of(properties.getRegion()))
                .credentialsProvider(DefaultCredentialsProvider.create())
                .endpointOverride(URI.create(properties.getAwsEndpointUrl()))
                .build();
    }

    /**
     * Sets up a CloudWatch Meter Registry.
     */
    @Bean
    public MeterRegistry getMeterRegistry(CloudWatchAsyncClient cloudWatchAsyncClient) {
        CloudWatchConfig cloudWatchConfig = setupCloudWatchConfig();

        CloudWatchMeterRegistry cloudWatchMeterRegistry = new CloudWatchMeterRegistry(cloudWatchConfig, Clock.SYSTEM, cloudWatchAsyncClient);
        cloudWatchMeterRegistry.config().meterFilter(percentiles("http", 0.90, 0.95, 0.99));
        return cloudWatchMeterRegistry;
    }

    @Bean
    @ConditionalOnMissingBean
    public FilterRegistrationBean<ServerHttpObservationFilter> webMvcMetricsFilter(ObservationRegistry registry) {
        ServerHttpObservationFilter filter = new ServerHttpObservationFilter(registry);
        FilterRegistrationBean<ServerHttpObservationFilter> registration = new FilterRegistrationBean<>(filter);
        registration.setOrder(Ordered.HIGHEST_PRECEDENCE + 1);
        registration.setDispatcherTypes(DispatcherType.REQUEST, DispatcherType.ASYNC);
        return registration;
    }

    @Bean
    TimedAspect timedAspect(MeterRegistry reg) {
        return new TimedAspect(reg);
    }

    /**
     * Sets up a configuration for cloudwatch exporting
     * cloudwatch.namespace: the namespace where these metrics will be pushed, mandatory
     * cloudwatch.step: how often the metrics are being published to cloudwatch, optional
     * cloudwatch.batch: how many metrics will be sent in a single batch, optional, default: 20
     */
    private CloudWatchConfig setupCloudWatchConfig() {
        return new CloudWatchConfig() {
            private Map<String, String> configuration
                    = Map.of("cloudwatch.namespace", properties.getNamespace(),
                    "cloudwatch.step", properties.getStep(),
                    "cloudwatch.batchSize", properties.getBatchSize(),
                    "cloudwatch.enabled", properties.getEnabled());

            @Override
            public String get(String key) {
                return configuration.get(key);
            }
        };
    }

    private MeterFilter percentiles(String prefix, double... percentiles) {
        return new MeterFilter() {
            @Override
            public DistributionStatisticConfig configure(Meter.Id id, DistributionStatisticConfig config) {
                if (id.getType() == Meter.Type.TIMER && id.getName().startsWith(prefix)) {
                    return DistributionStatisticConfig.builder()
                            .percentiles(percentiles)
                            .build()
                            .merge(config);
                }
                return config;
            }
        };
    }
}

package uk.gov.esos.api.common.config.jackson;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.module.paramnames.ParameterNamesModule;
import java.time.LocalDateTime;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import uk.gov.esos.api.common.domain.converter.LocalDateTimeDeserializerConverter;
import uk.gov.esos.api.common.domain.converter.LocalDateTimeSerializerConverter;

@Configuration
public class JacksonConfiguration {

	@Bean
	public ObjectMapper objectMapper(Jackson2ObjectMapperBuilder builder) {
	    return builder.build();
	}

	@Bean
	public MappingJackson2HttpMessageConverter customJackson2HttpMessageConverter(Jackson2ObjectMapperBuilder builder) {
		// Create a new Jackson module for custom serialization/deserialization of ZonedDateTime objects
		SimpleModule zonedDateModule = new SimpleModule();
		zonedDateModule.addSerializer(LocalDateTime.class, new LocalDateTimeSerializerConverter());
		zonedDateModule.addDeserializer(LocalDateTime.class, new LocalDateTimeDeserializerConverter());
		
		SimpleModule stringModule = new SimpleModule();
		stringModule.addDeserializer(String.class, new CustomStringDeserializer());

		ParameterNamesModule parameterNamesModule = new ParameterNamesModule();

		BigDecimalModule bigDecimalModule = new BigDecimalModule();

		return new MappingJackson2HttpMessageConverter(builder
            .modulesToInstall(stringModule, zonedDateModule, parameterNamesModule, bigDecimalModule)
            .build()
        );
	}

}

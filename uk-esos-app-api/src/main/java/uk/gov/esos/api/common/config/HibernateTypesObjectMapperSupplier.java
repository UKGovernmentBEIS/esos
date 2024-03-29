package uk.gov.esos.api.common.config;


import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.module.SimpleModule;
import io.hypersistence.utils.hibernate.type.util.ObjectMapperSupplier;
import uk.gov.esos.api.common.domain.converter.LocalDateTimeDeserializerConverter;
import uk.gov.esos.api.common.domain.converter.LocalDateTimeSerializerConverter;

import java.time.LocalDateTime;

public class HibernateTypesObjectMapperSupplier implements ObjectMapperSupplier {

    @Override
    public ObjectMapper get() {
        ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();
        objectMapper.setSerializationInclusion(Include.NON_NULL);
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        SimpleModule module = new SimpleModule();
        module.addSerializer(LocalDateTime.class, new LocalDateTimeSerializerConverter());
        module.addDeserializer(LocalDateTime.class, new LocalDateTimeDeserializerConverter());
        objectMapper.registerModule(module);
        return objectMapper;
    }
}

package uk.gov.esos.api.competentauthority.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.DirtiesContext;
import org.testcontainers.junit.jupiter.Testcontainers;
import uk.gov.esos.api.AbstractContainerBaseTest;
import uk.gov.esos.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.esos.api.competentauthority.domain.CompetentAuthority;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Optional;

@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@Testcontainers
@DataJpaTest
@Import({ObjectMapper.class})
public class CompetentAuthorityRepositoryIT extends AbstractContainerBaseTest {

    @Autowired
    CompetentAuthorityRepository competentAuthorityRepository;

    @Autowired
    EntityManager em;

    @Test
    void findById() {
    	CompetentAuthority ca = CompetentAuthority.builder().id(CompetentAuthorityEnum.ENGLAND).build();
    	em.persist(ca);
    	
    	em.flush();
    	em.clear();

		Optional<CompetentAuthority> result = competentAuthorityRepository.findById(CompetentAuthorityEnum.ENGLAND);
		assertThat(result).isNotEmpty();
		assertEquals(result.get().getId(), CompetentAuthorityEnum.ENGLAND);
    }
}
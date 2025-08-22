package uk.gov.esos.api.web.controller.account.organisation;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import uk.gov.esos.api.account.organisation.onboarding.domain.OnboardingEmailsDTO;
import uk.gov.esos.api.account.organisation.onboarding.domain.OnboardingRegistrationNumberDTO;
import uk.gov.esos.api.account.organisation.onboarding.domain.OnboardingRegistrationNumbersDTO;
import uk.gov.esos.api.account.organisation.onboarding.domain.OrganisationAccountOnboardingRegistryDTO;
import uk.gov.esos.api.account.organisation.onboarding.service.OrganisationAccountOnboardingRegistryQueryService;
import uk.gov.esos.api.account.organisation.onboarding.service.OrganisationAccountOnboardingRegistryService;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.web.config.AppUserArgumentResolver;
import uk.gov.esos.api.web.controller.exception.ExceptionControllerAdvice;
import uk.gov.esos.api.web.security.AppSecurityComponent;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class OrganisationAccountOnboardingRegistryControllerTest {

    private static final String CONTROLLER_PATH = "/v1.0/organisation/account-onboarding";

    @InjectMocks
    private OrganisationAccountOnboardingRegistryController controller;

    @Mock
    private OrganisationAccountOnboardingRegistryQueryService queryService;
    
    @Mock
    private OrganisationAccountOnboardingRegistryService service;

    @Mock
    private AppSecurityComponent appSecurityComponent;

    private MockMvc mockMvc;

    private ObjectMapper mapper;

    @BeforeEach
    public void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
            .setCustomArgumentResolvers(new AppUserArgumentResolver(appSecurityComponent))
            .setControllerAdvice(new ExceptionControllerAdvice())
            .build();

        mapper = new ObjectMapper();
    }

    @Test
    void getRegistrationNumberByEmail() throws Exception {
        String registrationNumber = "registrationNumber";
        String email = "user@esos.uk";
        AppUser user = AppUser.builder().email(email).build();
        OnboardingRegistrationNumberDTO expectedResponseDTO = OnboardingRegistrationNumberDTO.builder()
            .registrationNumber(registrationNumber)
            .build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
        when(queryService.getRegistrationNumberByEmail(email)).thenReturn(Optional.of(registrationNumber));

        MvcResult result = mockMvc
            .perform(MockMvcRequestBuilders.get(CONTROLLER_PATH + "/" + "registration-number"))
            .andReturn();

        MockHttpServletResponse response = result.getResponse();
        assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());

        OnboardingRegistrationNumberDTO actualResponseDTO =
            mapper.readValue(response.getContentAsString(), OnboardingRegistrationNumberDTO.class);

        assertEquals(expectedResponseDTO, actualResponseDTO);

        verify(queryService, times(1)).getRegistrationNumberByEmail(email);
    }

    @Test
    void getRegistrationNumberByEmail_no_response() throws Exception {
        String email = "user@esos.uk";
        AppUser user = AppUser.builder().email(email).build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
        when(queryService.getRegistrationNumberByEmail(email)).thenReturn(Optional.empty());

        MvcResult result = mockMvc
            .perform(MockMvcRequestBuilders.get(CONTROLLER_PATH + "/" + "registration-number"))
            .andReturn();

        MockHttpServletResponse response = result.getResponse();
        assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
        assertThat(response.getContentAsString()).isEmpty();

        verify(queryService, times(1)).getRegistrationNumberByEmail(email);
    }
    
    @Test
    void getExistingEmails() {
    	List<String> emails = List.of("test@test.com", "jane@doe.com");
    	OnboardingEmailsDTO emailsDTO = OnboardingEmailsDTO.builder()
				.emails(emails)
				.build();
    
        when(queryService.getExistingEmails(emails)).thenReturn(emails);

        ResponseEntity<OnboardingEmailsDTO> response = controller.getExistingVerifiedEmails(emailsDTO);

        // Verify
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(emails, response.getBody().getEmails());

        verify(queryService, times(1)).getExistingEmails(emails);
    }
    
    @Test
    void getExistingRegistrationNumbers() {
    	List<String> regNumbers = List.of("AA123456", "00000001");
    	OnboardingRegistrationNumbersDTO regNumbersDTO = OnboardingRegistrationNumbersDTO.builder()
				.registrationNumbers(regNumbers)
				.build();

        when(queryService.getExistingRegistrationNumbers(regNumbers)).thenReturn(regNumbers);

        ResponseEntity<OnboardingRegistrationNumbersDTO> response = controller.getExistingVerifiedRegistrationNumbers(regNumbersDTO);

        // Verify
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(regNumbers, response.getBody().getRegistrationNumbers());

        verify(queryService, times(1)).getExistingRegistrationNumbers(regNumbers);
    }
    
    @Test
    void addVerifiedOrganisationAccounts() throws Exception {
        String registrationNumber1 = "registrationNumber1";
        String email1 = "test1@test.com";
        String registrationNumber2 = "registrationNumber2";
        String email2 = "test2@test.com";
        AppUser user = AppUser.builder().email(email1).build();
        List<OrganisationAccountOnboardingRegistryDTO> verifiedAccounts = List.of(
        		OrganisationAccountOnboardingRegistryDTO.builder()
        		.email(email2)
        		.registrationNumber(registrationNumber2)
        		.build(),
        		OrganisationAccountOnboardingRegistryDTO.builder()
        		.email(email1)
        		.registrationNumber(registrationNumber1)
        		.build());
        
        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);

        mockMvc.perform(MockMvcRequestBuilders.post(CONTROLLER_PATH)
            .contentType(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(verifiedAccounts)))
        .andExpect(status().isNoContent());

        verify(service, times(1)).addOrganisationAccountOnboardingRegistries(verifiedAccounts, user);
    }
}
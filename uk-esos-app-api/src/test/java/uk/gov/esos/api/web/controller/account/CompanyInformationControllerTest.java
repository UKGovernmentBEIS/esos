package uk.gov.esos.api.web.controller.account;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import uk.gov.esos.api.account.client.domain.dto.CompanyProfileDTO;
import uk.gov.esos.api.account.client.service.CompanyInformationService;
import uk.gov.esos.api.web.controller.exception.ExceptionControllerAdvice;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CompanyInformationControllerTest {

    private static final String COMPANY_INFORMATION_CONTROLLER_PATH = "/v1.0/company-information";

    @InjectMocks
    private CompanyInformationController controller;

    @Mock
    private CompanyInformationService companyInformationService;

    private MockMvc mockMvc;

    private ObjectMapper mapper;

    @BeforeEach
    public void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
            .setControllerAdvice(new ExceptionControllerAdvice())
            .build();

        mapper = new ObjectMapper();
    }

    @Test
    void getCompanyProfileByRegistrationNumber() throws Exception {
        String registrationNumber = "12345678";
        CompanyProfileDTO expectedResponseDTO = CompanyProfileDTO.builder()
            .name("name")
            .registrationNumber(registrationNumber)
            .sicCodes(List.of("12345"))
            .build();

        when(companyInformationService.getCompanyProfile(registrationNumber)).thenReturn(expectedResponseDTO);

        MvcResult result = mockMvc
            .perform(MockMvcRequestBuilders.get(COMPANY_INFORMATION_CONTROLLER_PATH + "/" + registrationNumber))
            .andReturn();

        MockHttpServletResponse response = result.getResponse();
        assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());

        CompanyProfileDTO actualResponseDTO =
            mapper.readValue(result.getResponse().getContentAsString(), CompanyProfileDTO.class);

        assertEquals(expectedResponseDTO, actualResponseDTO);

        verify(companyInformationService, times(1)).getCompanyProfile(registrationNumber);
    }
}
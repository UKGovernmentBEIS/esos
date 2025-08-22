package uk.gov.esos.api.web.controller.user;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import uk.gov.esos.api.files.common.FileType;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;
import uk.gov.esos.api.user.core.service.UserSignatureService;
import uk.gov.esos.api.web.controller.exception.ExceptionControllerAdvice;

import java.nio.charset.StandardCharsets;

@ExtendWith(MockitoExtension.class)
public class UserSignatureControllerTest {

    private static final String CONTROLLER_PATH = "/v1.0/user-signatures";
    
    private MockMvc mockMvc;

    @InjectMocks
    private UserSignatureController controller;

    @Mock
    private UserSignatureService userSignatureService;
    
    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new ExceptionControllerAdvice())
                .build();
    }
    
    @Test
    void getSignature() throws Exception {
        String token = "token";
        byte[] fileContent = "fileContent".getBytes();
        FileDTO signature = FileDTO.builder()
            .fileName("fileName")
            .fileType(FileType.BMP.getMimeTypes().iterator().next())
            .fileContent(fileContent)
            .build();

        when(userSignatureService.getSignatureFileDTOByToken(token)).thenReturn(signature);

        MvcResult result = 
                mockMvc.perform(MockMvcRequestBuilders
                            .get(CONTROLLER_PATH + "/" + token))
                        .andReturn();

        MockHttpServletResponse response = result.getResponse();
        assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
        assertThat(response.getContentType()).isEqualTo(FileType.BMP.getMimeTypes().iterator().next());
        assertThat(response.getContentAsByteArray()).isEqualTo(fileContent);
        assertThat(response.getHeader(HttpHeaders.CONTENT_DISPOSITION)).isEqualTo(
                ContentDisposition.builder("signature").filename(signature.getFileName(), StandardCharsets.UTF_8).build().toString());
        
        verify(userSignatureService, times(1)).getSignatureFileDTOByToken(token);
    }
}

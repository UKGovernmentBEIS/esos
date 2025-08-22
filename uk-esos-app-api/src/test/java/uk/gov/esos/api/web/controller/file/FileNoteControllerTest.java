package uk.gov.esos.api.web.controller.file;

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
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.Validator;
import uk.gov.esos.api.files.common.domain.dto.FileDTO;
import uk.gov.esos.api.files.notes.service.FileNoteTokenService;
import uk.gov.esos.api.web.controller.exception.ExceptionControllerAdvice;

import java.nio.charset.StandardCharsets;

@ExtendWith(MockitoExtension.class)
class FileNoteControllerTest {

    private static final String CONTROLLER_PATH = "/v1.0/file-notes";

    private MockMvc mockMvc;

    @InjectMocks
    private FileNoteController controller;

    @Mock
    private FileNoteTokenService fileNoteTokenService;

    @Mock
    private Validator validator;

    @BeforeEach
    void setUp() {
        
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
            .setValidator(validator)
            .setControllerAdvice(new ExceptionControllerAdvice())
            .build();
    }

    @Test
    void getFileNote() throws Exception {
        
        final String token = "token";
        final String name = "name";
        final byte[] fileContent = name.getBytes();
        final FileDTO file = FileDTO.builder()
            .fileName(name)
            .fileType("application/pdf")
            .fileContent(fileContent)
            .build();

        when(fileNoteTokenService.getFileDTOByToken(token)).thenReturn(file);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders
                .get(CONTROLLER_PATH + "/" + token))
                .andReturn();

        MockHttpServletResponse response = result.getResponse();
        assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
        assertThat(response.getContentType()).isEqualTo(MediaType.APPLICATION_PDF.toString());
        assertThat(response.getContentAsByteArray()).isEqualTo(fileContent);
        assertThat(response.getHeader(HttpHeaders.CONTENT_DISPOSITION)).isEqualTo(
            ContentDisposition.builder("note").filename(name, StandardCharsets.UTF_8).build().toString());

        verify(fileNoteTokenService, times(1)).getFileDTOByToken(token);
    }
}
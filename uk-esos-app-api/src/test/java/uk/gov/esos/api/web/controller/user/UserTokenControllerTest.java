package uk.gov.esos.api.web.controller.user;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.Validator;

import com.fasterxml.jackson.databind.ObjectMapper;

import uk.gov.esos.api.token.JwtTokenActionEnum;
import uk.gov.esos.api.user.core.domain.dto.InvitationTokenDTO;
import uk.gov.esos.api.user.core.service.UserInvitationTokenService;
import uk.gov.esos.api.web.controller.exception.ExceptionControllerAdvice;

@ExtendWith(MockitoExtension.class)
class UserTokenControllerTest {

    private static final String USER_TOKEN_CONTROLLER_PATH = "/v1.0/users/token/";

    private MockMvc mockMvc;

    @InjectMocks
    private UserTokenController cut;

    @Mock
    private UserInvitationTokenService userInvitationTokenService;

    private ObjectMapper objectMapper;

    @Mock
    private Validator validator;

    @BeforeEach
    public void setUp() {
        objectMapper = new ObjectMapper();
        mockMvc = MockMvcBuilders.standaloneSetup(cut)
            .setControllerAdvice(new ExceptionControllerAdvice())
            .setValidator(validator)
            .build();
    }

    @Test
    void acceptInvitation() throws Exception {
        String email = "email";
        InvitationTokenDTO invitationToken = InvitationTokenDTO.builder().token("token").type(JwtTokenActionEnum.OPERATOR_INVITATION).build();

        when(userInvitationTokenService.resolveEmail(invitationToken))
            .thenReturn(email);

        mockMvc.perform(MockMvcRequestBuilders.post(USER_TOKEN_CONTROLLER_PATH + "resolve-email")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(invitationToken)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value("email"));


		verify(userInvitationTokenService, times(1)).resolveEmail(invitationToken);
    }
}
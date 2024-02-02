package uk.gov.esos.api.web.controller.workflow;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.aop.aspectj.annotation.AspectJProxyFactory;
import org.springframework.aop.framework.AopProxy;
import org.springframework.aop.framework.DefaultAopProxyFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import uk.gov.esos.api.authorization.core.domain.AppUser;
import uk.gov.esos.api.authorization.rules.services.AppUserAuthorizationService;
import uk.gov.esos.api.common.exception.BusinessException;
import uk.gov.esos.api.common.exception.ErrorCode;
import uk.gov.esos.api.web.config.AppUserArgumentResolver;
import uk.gov.esos.api.web.controller.exception.ExceptionControllerAdvice;
import uk.gov.esos.api.web.security.AuthorizationAspectUserResolver;
import uk.gov.esos.api.web.security.AuthorizedAspect;
import uk.gov.esos.api.web.security.AppSecurityComponent;
import uk.gov.esos.api.workflow.request.flow.payment.domain.CardPaymentCreateResponseDTO;
import uk.gov.esos.api.workflow.request.core.domain.enumeration.RequestTaskActionType;
import uk.gov.esos.api.workflow.request.flow.payment.domain.CardPaymentStateDTO;
import uk.gov.esos.api.workflow.request.flow.payment.domain.CardPaymentProcessResponseDTO;
import uk.gov.esos.api.workflow.request.flow.payment.service.CardPaymentService;


@ExtendWith(MockitoExtension.class)
class RequestTaskPaymentControllerTest {

    private static final String BASE_PATH = "/v1.0/tasks-payment";

    private MockMvc mockMvc;

    @InjectMocks
    private RequestTaskPaymentController requestTaskPaymentController;

    @Mock
    private CardPaymentService cardPaymentService;

    @Mock
    private AppUserAuthorizationService appUserAuthorizationService;

    @Mock
    private AppSecurityComponent appSecurityComponent;

    private ObjectMapper mapper;

    @BeforeEach
    public void setUp() {
        mapper = new ObjectMapper();

        AuthorizationAspectUserResolver authorizationAspectUserResolver = new AuthorizationAspectUserResolver(appSecurityComponent);
        AuthorizedAspect aspect = new AuthorizedAspect(appUserAuthorizationService, authorizationAspectUserResolver);

        AspectJProxyFactory aspectJProxyFactory = new AspectJProxyFactory(requestTaskPaymentController);
        aspectJProxyFactory.addAspect(aspect);

        DefaultAopProxyFactory proxyFactory = new DefaultAopProxyFactory();
        AopProxy aopProxy = proxyFactory.createAopProxy(aspectJProxyFactory);

        requestTaskPaymentController = (RequestTaskPaymentController) aopProxy.getProxy();

        mockMvc = MockMvcBuilders.standaloneSetup(requestTaskPaymentController)
            .setCustomArgumentResolvers(new AppUserArgumentResolver(appSecurityComponent))
            .setControllerAdvice(new ExceptionControllerAdvice())
            .build();
    }

    @Test
    void createCardPayment() throws Exception {
        Long requestTaskId =  1L;
        RequestTaskActionType requestTaskActionType = RequestTaskActionType.PAYMENT_PAY_BY_CARD;
        AppUser pmrvUser = AppUser.builder().userId("id").build();
        CardPaymentCreateResponseDTO cardPaymentCreateResponseDTO = CardPaymentCreateResponseDTO.builder()
            .nextUrl("response_url")
            .build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(pmrvUser);
        when(cardPaymentService.createCardPayment(requestTaskId, requestTaskActionType, pmrvUser)).thenReturn(
            cardPaymentCreateResponseDTO);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders
            .post(BASE_PATH + "/" + requestTaskId + "/create"))
            .andReturn();

        MockHttpServletResponse response = result.getResponse();
        assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
        assertThat(response.getContentType()).isEqualTo(MediaType.APPLICATION_JSON.toString());

        CardPaymentCreateResponseDTO responseDTO =
            mapper.readValue(result.getResponse().getContentAsString(), CardPaymentCreateResponseDTO.class);
        assertEquals(cardPaymentCreateResponseDTO, responseDTO);

        verify(cardPaymentService, times(1)).createCardPayment(requestTaskId, requestTaskActionType, pmrvUser);
    }

    @Test
    void createCardPayment_forbidden() throws Exception {
        Long requestTaskId =  1L;
        AppUser pmrvUser = AppUser.builder().userId("id").build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(pmrvUser);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
            .when(appUserAuthorizationService)
            .authorize(pmrvUser, "createCardPayment", String.valueOf(requestTaskId));

        mockMvc.perform(
            MockMvcRequestBuilders.post(BASE_PATH + "/" + requestTaskId + "/create"))
            .andExpect(status().isForbidden());

        verify(appSecurityComponent, times(1)).getAuthenticatedUser();
        verifyNoInteractions(cardPaymentService);
    }

    @Test
    void processExistingCardPayment() throws Exception {
        Long requestTaskId =  1L;
        RequestTaskActionType requestTaskActionType = RequestTaskActionType.PAYMENT_PAY_BY_CARD;
        AppUser pmrvUser = AppUser.builder().userId("id").build();
        String paymentId = "n4brhul26f2hn1lt992ejj10ht";
        CardPaymentStateDTO cardPaymentStateDTO = CardPaymentStateDTO.builder()
            .status("fail")
            .finished(true)
            .code("P0020")
            .message("Payment expired")
            .build();
        CardPaymentProcessResponseDTO cardPaymentProcessResponseDTO = CardPaymentProcessResponseDTO.builder()
            .paymentId(paymentId)
            .state(cardPaymentStateDTO)
            .build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(pmrvUser);
        when(cardPaymentService.processExistingCardPayment(requestTaskId, requestTaskActionType, pmrvUser)).thenReturn(
            cardPaymentProcessResponseDTO);

        mockMvc.perform(MockMvcRequestBuilders.post(BASE_PATH+ "/" + requestTaskId + "/process")
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("paymentId").value(paymentId))
            .andExpect(jsonPath("state.status").value(cardPaymentStateDTO.getStatus()))
            .andExpect(jsonPath("state.finished").value(cardPaymentStateDTO.isFinished()))
            .andExpect(jsonPath("state.code").value(cardPaymentStateDTO.getCode()))
            .andExpect(jsonPath("state.message").value(cardPaymentStateDTO.getMessage()));

        verify(appSecurityComponent, times(1)).getAuthenticatedUser();
        verify(cardPaymentService, times(1)).processExistingCardPayment(requestTaskId, requestTaskActionType, pmrvUser);
    }

    @Test
    void processExistingCardPayment_forbidden() throws Exception {
        Long requestTaskId =  1L;
        AppUser pmrvUser = AppUser.builder().userId("id").build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(pmrvUser);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
            .when(appUserAuthorizationService)
            .authorize(pmrvUser, "processExistingCardPayment", String.valueOf(requestTaskId));

        mockMvc.perform(
            MockMvcRequestBuilders.post(BASE_PATH + "/" + requestTaskId + "/process"))
            .andExpect(status().isForbidden());

        verify(appSecurityComponent, times(1)).getAuthenticatedUser();
        verifyNoInteractions(cardPaymentService);
    }
}
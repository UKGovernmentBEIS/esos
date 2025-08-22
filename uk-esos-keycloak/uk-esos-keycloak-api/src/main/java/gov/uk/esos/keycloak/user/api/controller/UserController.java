package gov.uk.esos.keycloak.user.api.controller;

import gov.uk.esos.keycloak.user.api.model.SignatureDTO;
import gov.uk.esos.keycloak.user.api.model.UserDetailsDTO;
import gov.uk.esos.keycloak.user.api.model.UserDetailsRequestDTO;
import gov.uk.esos.keycloak.user.api.model.UserInfo;
import gov.uk.esos.keycloak.user.api.model.UserOtpValidationDTO;
import gov.uk.esos.keycloak.user.api.service.UserDetailsService;
import gov.uk.esos.keycloak.user.api.service.UserEntityService;
import gov.uk.esos.keycloak.user.api.service.UserOtpService;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

public class UserController {

    private final UserEntityService userEntityService;
    private final UserDetailsService userDetailsService;
    private final UserOtpService userOtpService;

    public UserController(UserEntityService userEntityService, UserDetailsService userDetailsService, UserOtpService userOtpService) {
        this.userEntityService = userEntityService;
        this.userDetailsService = userDetailsService;
        this.userOtpService = userOtpService;
    }

    @POST
    @Path("")
    @Produces(MediaType.APPLICATION_JSON)
    public List<UserInfo> getUsers(List<String> userIds,
                                   @QueryParam("includeAttributes") boolean includeAttributes) {
        return userEntityService.getUsersInfo(userIds, includeAttributes);
    }
    
    @GET
    @Path("/user/details")
    @Produces(MediaType.APPLICATION_JSON)
    public UserDetailsDTO getUserDetails(@QueryParam("userId") String userId) {
        return userDetailsService.getUserDetails(userId);
    }   
    
    @POST
    @Path("/user/details")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public void saveUserDetails(UserDetailsRequestDTO userDetailsRequestDTO) {
        userDetailsService.saveUserDetails(userDetailsRequestDTO);
    }
    
    @GET
    @Path("/user/signature")
    @Produces(MediaType.APPLICATION_JSON)
    public SignatureDTO getUserSignature(@QueryParam("signatureUuid") String signatureUuid) {
        return userDetailsService.getUserSignature(signatureUuid);
    }

    @POST
    @Path("/otp/validation")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public void validateUserOtp(UserOtpValidationDTO userOtpValidationDTO) {
        userOtpService.validateUserOtp(userOtpValidationDTO);
    }

}

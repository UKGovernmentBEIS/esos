<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=!messagesPerField.existsError('totp'); section>
    <#if section = "headerCaption">
        ${msg("doLogInTotpCaption")}
    <#elseif section="header">
        ${msg("doLogInTotp")}
    <#elseif section="form">
        <p class="govuk-body">
            Use the code from the authenticator app you previously used to sign in to your ESOS account.
            Do not use a code generated for your GOV.UK One Login.
        </p>
        <form id="kc-otp-login-form" class="${properties.kcFormClass!}" action="${url.loginAction}"
            method="post">
            <#if otpLogin.userOtpCredentials?size gt 1>
                <div class="${properties.kcFormGroupClass!}">
                    <div class="${properties.kcInputWrapperClass!}">
                        <#list otpLogin.userOtpCredentials as otpCredential>
                            <input id="kc-otp-credential-${otpCredential?index}" class="${properties.kcLoginOTPListInputClass!}" type="radio" name="selectedCredentialId" value="${otpCredential.id}" <#if otpCredential.id == otpLogin.selectedCredentialId>checked="checked"</#if>>
                            <label for="kc-otp-credential-${otpCredential?index}" class="${properties.kcLoginOTPListClass!}" tabindex="${otpCredential?index}">
                                <span class="${properties.kcLoginOTPListItemHeaderClass!}">
                                    <span class="${properties.kcLoginOTPListItemIconBodyClass!}">
                                      <i class="${properties.kcLoginOTPListItemIconClass!}" aria-hidden="true"></i>
                                    </span>
                                    <span class="${properties.kcLoginOTPListItemTitleClass!}">${otpCredential.userLabel}</span>
                                </span>
                            </label>
                        </#list>
                    </div>
                </div>
            </#if>

			<#assign hasError = (message?has_content && message.summary?has_content && (message.type != 'warning' || !isAppInitiatedAction??))>
			<div class="${properties.kcFormGroupClass!} ${hasError?then('govuk-form-group--error', '')}">      
				<#if hasError>
					<span class="govuk-error-message" role="alert">
						${kcSanitize(message.summary)?no_esc}
					</span>
				</#if>
				<div class="${properties.kcInputWrapperClass!}">
                    <label id="otp-hint" for="otpCode" class="govuk-hint">
					    ${msg("loginTotpAuthenticatorAppCode")}
				    </label>
					<input id="otpCode" name="otp" autocomplete="off" type="text" class="${properties.kcInputClass!} govuk-input--width-10"
					autofocus/>
				</div>
			</div>

            <div class="${properties.kcFormGroupClass!}">
                <div id="kc-form-options" class="${properties.kcFormOptionsClass!}">
                    <div class="${properties.kcFormOptionsWrapperClass!}">
                    </div>
                </div>

                <div id="kc-form-buttons" class="${properties.kcFormButtonsClass!} govuk-button-group">
                    <input
                        class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}"
                        name="login" id="kc-login" type="submit" value="${msg("doLogIn")}" />
                    <a class="govuk-link" role="button" name="cancel" href="${url.loginAction}&formAction=cancel">${msg("btnCancelTxt")}</a>
                </div>
            </div>
        </form>
    </#if>
</@layout.registrationLayout>
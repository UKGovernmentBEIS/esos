<#-- UPDATE PASSWORD PAGE-->
<#import "template.ftl" as layout>

<@layout.registrationLayout displayInfo=false; section>
    <#if section = "header">
        ${msg("updatePasswordTitle")}
    <#elseif section = "form">
		<div class="govuk-grid-row">
            <div class="govuk-grid-column-two-thirds">
				<form id="kc-passwd-update-form" class="${properties.kcFormClass!}" action="${url.loginAction}" method="post">
				
					<input type="text" id="username" name="username" value="${username}" autocomplete="username" readonly="readonly" style="display:none;"/>
					<input type="password" id="password" name="password" autocomplete="current-password" style="display:none;"/>
						   
					<p class="govuk-body">${msg("updatePasswordTitle")}</p>
					
					<div class="${properties.kcFormGroupClass!}">
						<div class="${properties.kcLabelWrapperClass!}">
							<label for="password-new" class="${properties.kcLabelClass!}">${msg("passwordNew")}</label>
							<div class="govuk-hint" id="password-hint">${msg("updatePasswordHint")}</div>
						</div>
						<div class="${properties.kcInputWrapperClass!}">
							<input type="password" id="password-new" name="password-new" class="${properties.kcInputClass!} govuk-!-width-three-quarters"
								   autofocus autocomplete="new-password"/>
							<button type="button" class="govuk-button govuk-button--secondary toggle-password" tabindex="-1">Show</button>
						</div>
					</div>

					<div class="${properties.kcFormGroupClass!}">
						<div class="${properties.kcLabelWrapperClass!}">
							<label for="password-confirm" class="${properties.kcLabelClass!}">${msg("passwordConfirm")}</label>
						</div>
						<div class="${properties.kcInputWrapperClass!}">
							<input type="password" id="password-confirm" name="password-confirm"
								   class="${properties.kcInputClass!} govuk-!-width-three-quarters" autocomplete="new-password"/>
							<button type="button" class="govuk-button govuk-button--secondary toggle-password" tabindex="-1">Show</button>
						</div>
					</div>
					
					<div class="${properties.kcFormGroupClass!}">
						<div id="kc-form-options">
							<#if isAppInitiatedAction??>
								<div class="checkbox">
									<label>
										<input id="logout-sessions" name="logout-sessions" type="checkbox" value="on" checked> ${msg("logoutOtherSessions")}
									</label>
								</div>
							</#if>
						</div>

						<div id="kc-form-buttons" class="${properties.kcFormButtonsClass!}">
							<#if isAppInitiatedAction??>
								<input class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonLargeClass!}"
									   type="submit" value="${msg("doSubmit")}"/>
								<button
								class="${properties.kcButtonClass!} ${properties.kcButtonDefaultClass!} ${properties.kcButtonLargeClass!}"
								type="submit" name="cancel-aia" value="true" />${msg("doCancel")}</button>
							<#else>
								<input class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}"
									   type="submit" value="${msg("doSubmit")}"/>
							</#if>
						</div>
					</div>
				</form>
			</div>
		</div>
    </#if>
</@layout.registrationLayout>
<script src="${url.resourcesPath}/js/password-reveal.js" type="text/javascript"></script>






















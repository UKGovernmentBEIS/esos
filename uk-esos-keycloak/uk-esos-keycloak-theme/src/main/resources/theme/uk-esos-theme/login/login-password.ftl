<#import "template.ftl" as layout>

<@layout.registrationLayout displayInfo=social.displayInfo displayResetLinks=true displayWide=(realm.password && social.providers??); section>
    <#if section = "headerCaption">
        ${msg("loginAccountTitleCaption")}
    </#if>
    <#if section = "header">
        ${msg("loginAccountTitle")}
	<#elseif section = "info" >
        <p class="govuk-body">
            Enter the password you used when you last signed in to ESOS.
            Next, you will be asked for the 6-digit code from ESOS authenticator app.
        </p>
<#--		<#if realm.password && realm.registrationAllowed && !registrationDisabled??>-->
<#--			<div id="kc-registration" class="govuk-body">-->
<#--				<span>${msg("youMust")} <a class="govuk-link" href="${properties.registrationUrl}">${msg("doCreateSignIn")}</a> ${msg("useService")}</span>-->
<#--			</div>-->
<#--		</#if>-->
    <#elseif section = "form">
    <div id="kc-form" <#if realm.password && social.providers??>class="${properties.kcContentWrapperClass!}"</#if>>
      <div id="kc-form-wrapper" <#if realm.password && social.providers??>class="${properties.kcFormSocialAccountContentClass!} ${properties.kcFormSocialAccountClass!}"</#if>>
        <#if realm.password>
        
            <form id="kc-form-login" onsubmit="login.disabled = true; return true;" action="${url.loginAction}" method="post">
                            
<#--                <div class="govuk-form-group">                               -->
<#--                    <label for="username" class="govuk-label"><#if !realm.loginWithEmailAllowed>${msg("username")}<#elseif !realm.registrationEmailAsUsername>${msg("usernameOrEmail")}<#else>${msg("email")}</#if></label>-->
<#--                    <#if usernameEditDisabled??>-->
<#--                        <input id="username" class="govuk-input govuk-!-width-two-thirds" name="username" value="${(login.username!'')}" type="text" disabled />-->
<#--                    <#else>-->
<#--                        <input id="username" class="govuk-input govuk-!-width-two-thirds" name="username" value="${(login.username!'')}"  type="text" autofocus autocomplete="username email" />-->
<#--                    </#if>-->
<#--                </div>-->
                <p class="govuk-body">Email address</p>
                <p class="govuk-body">${(login.username!'')}</p>

                <div class="govuk-form-group">
                    <label for="password" class="govuk-label">${msg("password")}</label>
                    <input id="password" class="govuk-input govuk-!-width-one-third" name="password" type="password" autocomplete="off" />
					<button id="togglePasswordBtn" type="button" class="govuk-button govuk-button--secondary toggle-password" tabindex="-1">Show</button>
                </div>

                <div class="${properties.kcFormGroupClass!} ${properties.kcFormSettingClass!}">
                    <div id="kc-form-options">
                        <#if realm.rememberMe && !usernameEditDisabled??>
                            <div class="checkbox">
                                <label>
                                    <#if login.rememberMe??>
                                        <input id="rememberMe" name="rememberMe" type="checkbox" checked> ${msg("rememberMe")}
                                    <#else>
                                        <input id="rememberMe" name="rememberMe" type="checkbox"> ${msg("rememberMe")}
                                    </#if>
                                </label>
                            </div>
                        </#if>
                        </div>
                  </div>

                  <div id="kc-form-buttons" class="govuk-button-group">
                      <input class="govuk-button" data-module="govuk-button" name="login" id="kc-login" type="submit" value="${msg("doLogIn")}"/>
                      <a class="govuk-link" role="button" name="cancel" href="${url.loginAction}&formAction=cancel">${msg("btnCancelTxt")}</a>
                  </div>
            </form>
        </#if>
        </div>
        <#if realm.password && social.providers??>
            <div id="kc-social-providers" class="${properties.kcFormSocialAccountContentClass!} ${properties.kcFormSocialAccountClass!}">
                <ul class="${properties.kcFormSocialAccountListClass!} <#if social.providers?size gt 4>${properties.kcFormSocialAccountDoubleListClass!}</#if>">
                    <#list social.providers as p>
                        <li class="${properties.kcFormSocialAccountListLinkClass!}"><a href="${p.loginUrl}" id="zocial-${p.alias}" class="zocial ${p.providerId}"> <span>${p.displayName}</span></a></li>
                    </#list>
                </ul>
            </div>
        </#if>
      </div>
    </#if>

</@layout.registrationLayout>

<script src="${url.resourcesPath}/js/password-reveal.js" type="text/javascript"></script>
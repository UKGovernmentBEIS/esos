<#import "template.ftl" as layout>
<@layout.registrationLayout displayProblems=false displayResetLinks=false displayInfo=false; section>
    <#if section = "headerCaption">
        ${msg("verifyPasswordTitleCaption")}
    <#elseif section = "header">
        ${msg("verifyPasswordTitle")}
    <#elseif section = "form">
        <form id="kc-form-login" onsubmit="login.disabled = true; return true;" action="${url.loginAction}"
              method="post">
            <p class="govuk-body">Email address<br/>${(email!'')}</p>

            <div class="govuk-form-group">
                <label for="password" class="govuk-label">${msg("password")}</label>
                <input id="password" class="govuk-input govuk-!-width-one-third" name="password" type="password"
                       autocomplete="off"/>
                <button id="togglePasswordBtn" type="button"
                        class="govuk-button govuk-button--secondary toggle-password" tabindex="-1">Show
                </button>
            </div>

            <div id="kc-form-buttons" class="govuk-button-group">
                <input class="govuk-button" data-module="govuk-button" name="login" id="kc-login" type="submit"
                       value="${msg("continueButtonText")}"/>
            </div>
        </form>

        <div id="kc-problems-sign-in" class="${properties.kcSignUpClass!}">
            <div id="kc-problems-sign-in-wrapper" class="${properties.kcInfoAreaWrapperClass!}">
                <div id="kc-solutions" class="govuk-body">
                    <ul class="govuk-list">
                        <li>
                            <a id="forgotCredentialsLink" class="govuk-link" target="_blank"
                               href="${properties.fordwayResetCredentialsUrl}">${msg("forgotCredentialsText")}</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </#if>
</@layout.registrationLayout>

<script src="${url.resourcesPath}/js/password-reveal.js" type="text/javascript"></script>

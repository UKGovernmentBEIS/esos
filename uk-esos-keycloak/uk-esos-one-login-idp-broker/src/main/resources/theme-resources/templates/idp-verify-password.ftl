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
                       value="${msg("doLogIn")}"/>
            </div>
        </form>
    </#if>
</@layout.registrationLayout>

<script src="${url.resourcesPath}/js/password-reveal.js" type="text/javascript"></script>

<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=false; section>
    <#if section = "form">
        <div class="govuk-panel govuk-panel--confirmation">
            <h1 class="govuk-panel__title">
                ${msg("emailConfirmationSuccessPanel")}
            </h1>
        </div>

        <form id="kc-placeholder-form" class="${properties.kcFormClass!}" action="${url.loginAction}" method="post">
            <div class="govuk-button-group">
                <button type="submit" class="govuk-button" name="submit" id="submit">
                    ${msg("btnContinueTxt")}
                </button>
                <a class="govuk-link" role="button" name="cancel" href="${url.loginAction}&formAction=cancel">${msg("btnCancelTxt")}</a>
            </div>
        </form>
    </#if>
</@layout.registrationLayout>
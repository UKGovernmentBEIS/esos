<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=false; section>
    <#if section = "headerCaption">
        ${msg("newUserInfoTitleCaption")}
    <#elseif section = "header">
        ${msg("newUserInfoHeader")}
    <#elseif section = "form">
        <p class="govuk-body">
            We’ll email you when there’s something to do in ESOS, and send confirmations or other system messages.
        </p>
        <p class="govuk-body">
            You can use the same email address as your GOV.UK One Login, or a different one.
        </p>

        <form id="kc-new-user-info-form" class="${properties.kcFormClass!}" action="${url.loginAction}" method="post">

            <div class="${properties.kcFormGroupClass} <#if messagesPerField.existsError('email')>govuk-form-group--error</#if>">
                <label class="govuk-label" for="email">
                    Email address
                </label>
                <#if messagesPerField.existsError('email')>
                <p class="govuk-error-message">
                    <span class="govuk-visually-hidden">Error:</span>
                    ${kcSanitize(messagesPerField.getFirstError('email'))?no_esc}
                </p>
                </#if>
                <input class="govuk-input <#if messagesPerField.existsError('email')>govuk-input--error</#if>"
                       id="email" name="email" type="email">
            </div>

            <div class="${properties.kcFormGroupClass} <#if messagesPerField.existsError('firstName')>govuk-form-group--error</#if>">
                <label class="govuk-label" for="first-name">
                    First name
                </label>
                <#if messagesPerField.existsError('firstName')>
                    <p class="govuk-error-message">
                        <span class="govuk-visually-hidden">Error:</span>
                        ${kcSanitize(messagesPerField.getFirstError('firstName'))?no_esc}
                    </p>
                </#if>
                <input class="govuk-input <#if messagesPerField.existsError('firstName')>govuk-input--error</#if>"
                       id="first-name" name="firstName" type="text">
            </div>

            <div class="${properties.kcFormGroupClass} <#if messagesPerField.existsError('lastName')>govuk-form-group--error</#if>">
                <label class="govuk-label" for="last-name">
                    Last name
                </label>
                <#if messagesPerField.existsError('lastName')>
                    <p class="govuk-error-message">
                        <span class="govuk-visually-hidden">Error:</span>
                        ${kcSanitize(messagesPerField.getFirstError('lastName'))?no_esc}
                    </p>
                </#if>
                <input class="govuk-input <#if messagesPerField.existsError('lastName')>govuk-input--error</#if>"
                       id="last-name" name="lastName" type="text">
            </div>

            <div class="govuk-button-group">
                <button type="submit" class="govuk-button" name="submit" id="submit">
                    ${msg("btnContinueTxt")}
                </button>
                <a class="govuk-link" id="cancel" role="button" name="cancel" value="cancel" href="${url.loginAction}&formAction=cancel">${msg("btnCancelTxt")}</a>
            </div>
        </form>
    </#if>
</@layout.registrationLayout>
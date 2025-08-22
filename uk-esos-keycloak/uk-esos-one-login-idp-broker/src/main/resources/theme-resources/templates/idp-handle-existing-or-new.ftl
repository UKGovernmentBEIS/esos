<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=false; section>
    <#if section = "header">
        ${msg("handleExistingOrNewHeader")}
    <#elseif section = "form">
        <p class="govuk-body govuk-!-font-weight-bold">
            Do you already have an ESOS user account?
        <p class="govuk-body">
            For example, you may have created an ESOS account in the past and signed in to work on tasks like a
            notification of compliance or an action plan.
        </p>
        <form id="kc-assoc-email-form" class="${properties.kcFormClass!}" action="${url.loginAction}" method="post">

            <div class="${properties.kcFormGroupClass}">
                <fieldset class="govuk-fieldset">
                    <div class="govuk-radios" data-module="govuk-radios">
                        <div class="govuk-radios__item">
                            <input class="govuk-radios__input" id="existing-user-option"
                                   name="existing" type="radio" checked
                                   data-aria-controls="existing-user-option" value="true">
                            <label class="govuk-label govuk-radios__label" for="existing-user-option">
                                Yes, I want to connect my existing ESOS account to GOV.UK One Login
                            </label>
                        </div>
                        <div class="govuk-radios__item">
                            <input class="govuk-radios__input" id="new-user-option" name="existing"
                                   type="radio" data-aria-controls="new-user-option" value="false">
                            <label class="govuk-label govuk-radios__label" for="new-user-option">
                                No, I want to create a new ESOS account
                            </label>
                        </div>
                    </div>
                </fieldset>
            </div>

            <button type="submit" class="govuk-button" name="submitOption" id="submit-option">
                ${msg("btnContinueTxt")}
            </button>
        </form>
    </#if>
</@layout.registrationLayout>
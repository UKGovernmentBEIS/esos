<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=false; section>
    <#if section = "header">
        ${msg("verificationEmailSentTitle")}
    <#elseif section = "form">
        <p class="govuk-body">
            We have sent a verification email to ${email}<br/><br/>
            Click on the link in the email to confirm you can still access this address.<br/><br/>
            Your email might take a few minutes to arrive. If you do not get an email, check your spam folder.<br/><br/>
            The link will expire in ${linkExpirationHours} hours.<br/><br/>
        </p>

        <details class="govuk-details">
            <summary class="govuk-details__summary">
                <span class="govuk-details__summary-text">
                  I did not get an email
                </span>
            </summary>
            <div class="govuk-details__text">
                PLACEHOLDER
            </div>
        </details>
    </#if>
</@layout.registrationLayout>
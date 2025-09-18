<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=false; section>
    <#if section = "header">
        ${msg("verificationEmailSentTitle")}
    <#elseif section = "form">
        <p class="govuk-body">
            We have sent a verification email to <b>${email}</b><br/><br/>
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
                If you have not received the email after a few minutes, check your spam or junk folder.
                The subject of the email is ‘Confirm your ESOS email address – Energy Savings Opportunity Scheme (ESOS)’.
                <br/>
                What to do next if it still hasn’t arrived:
                <ul class="govuk-list govuk-list--bullet">
                    <li>
                        if you created the account yourself,
                        <a class="govuk-link" id="cancel" role="button" name="cancel" value="cancel" href="${url.loginAction}&formAction=cancel">
                            restart the process.
                        </a>
                    </li>
                    <li>if you were invited to join, use the link in your invitation email.</li>
                </ul>

            </div>
        </details>
    </#if>
</@layout.registrationLayout>
<#--UPDATE ACTIONS PAGE & SUCCESS OF UPDATE ACTIONS PAGE-->
<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=false; section>
    <#if section = "header">
        <#if messageHeader??>
            ${messageHeader}
        <#elseif message.summary != msg("accountUpdatedMessage")>
            ${message.summary}
        </#if>
    <#elseif section = "form">
        <div id="kc-info-message">
            <#if actionUri?has_content>
                <p class="govuk-body">${msg("proceedWithUpdateActions")}</p>
            </#if>
            <#if skipLink??>
            <#--                case of the update success page      -->
                <#if !actionUri?? && message.summary == msg("accountUpdatedMessage")>
                    <div class="govuk-grid-row">
                        <div class="govuk-grid-column-two-thirds">

                            <div class="govuk-panel govuk-panel--confirmation">
                                <h1 class="govuk-panel__title">
                                    ${msg("successTitle")}
                                </h1>
                            </div>

                            <p class="govuk-body">${msg("confirmationEmailText")}</p>

                            <h1 class="govuk-heading-m">${msg("whatHappensNextText")}</h1>
                            <p class="govuk-body">
                                ${msg("whatHappensNextText1")} <a
                                        href="${properties.homeUrl}">${msg("whatHappensNextText2")}</a> ${msg("whatHappensNextText3")}
                            </p>
                        </div>
                    </div>
                </#if>
            <#else>
                <#if actionUri?has_content>
                    <p>
                        <#-- fake a GDS button with a link because the url did not work as expected when using a form and a button                        -->
                        <a href="${actionUri}"
                           class="${properties.kcButtonClass!} ${properties.kcButtonDefaultClass!} ${properties.kcButtonLargeClass!} ${properties.kcButtonLargeClass!}"
                        >${msg("continueButtonText")}</a>
                    </p>
                <#elseif (client.baseUrl)?has_content>
                    <p><a href="${properties.homeUrl}">${kcSanitize(msg("backToApplication"))?no_esc}</a></p>
                </#if>
            </#if>
        </div>
    </#if>
</@layout.registrationLayout>
<#-- EXPIRED ACTIONS PAGE -->
<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=false; section>
    <#if section = "header">
		<#if message.summary == msg("expiredActionMessage") || message.summary == msg("expiredActionTokenNoSessionMessage") || message.summary == msg("expiredActionTokenSessionExistsMessage")>
			${msg("linkExpiredErrorTitle")}
		<#else>
			${msg("errorTitle")}
		</#if>
    <#elseif section = "form">
        <div id="kc-error-message">
            <#if client?? && client.baseUrl?has_content>
                <p><a id="backToApplication" href="${properties.homeUrl}">${kcSanitize(msg("backToApplication"))?no_esc}</a>
                </p>
            </#if>
        </div>
    </#if>
</@layout.registrationLayout>
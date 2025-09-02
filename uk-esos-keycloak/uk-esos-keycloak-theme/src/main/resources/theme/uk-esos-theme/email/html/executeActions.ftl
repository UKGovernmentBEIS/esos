<#outputformat "plainText">
    <#assign requiredActionsText>
        <#if requiredActions??>
            <#list requiredActions>
                <#items as reqActionItem>${msg("requiredAction.${reqActionItem}")}
                    <#sep>, </#sep>
                </#items>
            </#list>
        </#if>
    </#assign>
</#outputformat>

<html>
<body>
<p>${msg("executeActionsRequestApproveText")}</p>
<p>${msg("executeActionsUseLinkText")}</p>
<p><a href="${link}">${msg("executeActionsResetPasswordText")}</a></p>
<p>${msg("executeActionsExpireLinkText", linkExpiration?int)}</p>
<p>${msg("executeActionsContactText")} <a
            href="mailto: ${msg("esosHelpdesk")}">${msg("executeActionsContactLinkText")}</a>.</p>
<p>${msg("executeActionsDoNotReplyText")}</p>
</body>
</html>
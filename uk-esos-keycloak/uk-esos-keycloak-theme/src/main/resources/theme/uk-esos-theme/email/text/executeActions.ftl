<#ftl output_format="plainText">
<#assign requiredActionsText><#if requiredActions??><#list requiredActions><#items as reqActionItem>${msg("requiredAction.${reqActionItem}")}<#sep>, </#items></#list><#else></#if></#assign>

${msg("executeActionsRequestApproveText")}
${msg("executeActionsUseLinkText")}
${link}
${msg("executeActionsExpireLinkText", (linkExpiration/60)?int)}
${msg("executeActionsContactText")} ${msg("executeActionsContactLinkText")} ${msg("esosHelpdesk")}
${msg("executeActionsDoNotReplyText")}
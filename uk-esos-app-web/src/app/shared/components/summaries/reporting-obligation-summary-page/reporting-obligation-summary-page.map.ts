export const reportingObligationContentMap = {
  qualificationType: {
    QUALIFY: 'Yes, the organisation qualifies for ESOS and will submit a notification',
    NOT_QUALIFY: 'No, the organisation does not qualify for ESOS and will not submit a notification',
  },
  qualificationReason: {
    TURNOVER_MORE_THAN_44M:
      'The annual turnover is over £44 million and annual balance sheet total in excess of £38 million',
    STAFF_MEMBERS_MORE_THAN_250: 'The organisation has 250 or more members of staff',
    TURNOVER_MORE_THAN_44M_AND_STAFF_MEMBERS_MORE_THAN_250:
      'The annual turnover is over £44 million and annual balance sheet total in excess of £38 million, and the organisation has 250 or more members of staff',
    CONDITIONS_NOT_MET:
      'The organisation does not meet any of these conditions, but belongs to a corporate group containing an organisation that does meet these conditions',
  },
  energyResponsibility: {
    RESPONSIBLE: 'Yes, the organisation is responsible for energy',
    NOT_RESPONSIBLE: 'No, the organisation has no energy responsibility and the total energy consumption is zero',
    RESPONSIBLE_BUT_LESS_THAN_40000_KWH:
      'Yes, the organisation is responsible for energy, but used less than 40,000 kWh of energy in the reference period',
  },
};

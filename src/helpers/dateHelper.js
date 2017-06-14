module.exports.fixDate = function (dashboardData) {
  return dashboardData.map(function (userData) {
    userData.birth_date_formatted = userData.birth_date.toString().slice(0,15);
    userData.time_stamp_formatted = userData.time_stamp.toString().slice(0,21);
    return userData;
  });
};

module.exports.fixAccomDates = function (accomHistory) {
  accomHistory.start_date = accomHistory.start_date__c.slice(8).concat(' ').concat(accomHistory.start_date__c.slice(5,7)).concat(' ').concat(accomHistory.start_date__c.slice(0,4));
  accomHistory.end_date = accomHistory.end_date__c.slice(8).concat(' ').concat(accomHistory.end_date__c.slice(5,7)).concat(' ').concat(accomHistory.end_date__c.slice(0,4))
  return accomHistory;
}

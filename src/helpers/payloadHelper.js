module.exports.checkInfoRequested = function (payload) {
  let requestedInfo = {};
  if (payload.rentalHistory === 'on')
    requestedInfo.rentalHistory = true;
  if (payload.rentalArrears === 'on')
    requestedInfo.rentalArrears = true;
    requestedInfo.ticket = true;
  if (payload.rentalReference === 'on')
    requestedInfo.rentalReference = true;
    requestedInfo.ticket = true;
  if (payload.otherRequests)
    requestedInfo.otherRequests = payload.otherRequests;
    requestedInfo.ticket = true;
  if (payload.email.length)
    requestedInfo.email = payload.email;
  if (payload.street.length)
    requestedInfo.mail = payload.street + ', ' + payload.town + ', ' + payload.postcode;
  return requestedInfo;
}

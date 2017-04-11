const env = require('env2')('./config.env');
const authMiddleware = require('../helpers/authMiddleware.js');
const nforce = require('nforce');
const hapi = require('hapi');
const dateHelper = require('../helpers/dateHelper.js');
const userHelper = require('../helpers/userHelper');
const formHelper = require('../helpers/payloadHelper.js');
const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const securityToken = process.env.SECURITY_TOKEN;


module.exports = {
  method: 'POST',
  path:'/salesforce',
  config: {
    auth: {
      strategy: 'base'
    },
    pre: [
        { method: authMiddleware, assign: 'user' }
    ],
    handler: (req, reply) => {
      let infoRequested = formHelper.checkInfoRequested(req.payload);
      let firstName = userHelper.getFirstName(req.pre.user.givenNames);
      infoRequested.name = firstName;

      if (infoRequested.rentalHistory) {
        const org = nforce.createConnection({
          clientId: process.env.SALESFORCE_KEY,
          clientSecret: process.env.SALESFORCE_SECRET,
          redirectUri: process.env.SF_REDIRECT,
          environment: 'sandbox',
          mode: 'single'
        });

        org.authenticate({ username: username, password: password, securityToken: securityToken }, function(err, resp) {

          if(!err) {
            org.query({ query: `SELECT Start_Date__c, End_Date__c FROM Bedspace_Status__c WHERE Client__c IN (SELECT Id FROM Contact WHERE Contact.FirstName='${firstName}')`}, function(err, res) {
              if(err) return console.error(err);
              else
              infoRequested.accomHistory = res.records[0]._fields;
              infoRequested.accomHistory = dateHelper.fixAccomDates(infoRequested.accomHistory);
              reply.view('data', infoRequested);
            });
          } else {
            console.log('Error: ' + err.message);
          }
        });
      } else {
        reply.view('data', infoRequested);
      }
    }
  }
};

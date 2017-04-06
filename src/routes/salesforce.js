const env = require('env2')('./config.env');
const authMiddleware = require('../helpers/authMiddleware.js');
const nforce = require('nforce');
const hapi = require('hapi');
const dateHelper = require('../helpers/dateHelper.js');
const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const securityToken = process.env.SECURITY_TOKEN;


module.exports = {
  method: 'GET',
  path:'/salesforce',
  // config: {
  //   auth: {
  //     strategy: 'base'
  //   },
  //   pre: [
  //       { method: authMiddleware, assign: 'user' }
  //   ],
    handler: (req, reply) => {
      // This var is going to need to come in on the request obj
      let name = 'Lucy';
      const org = nforce.createConnection({
        clientId: process.env.SALESFORCE_KEY,
        clientSecret: process.env.SALESFORCE_SECRET,
        redirectUri: process.env.SF_REDIRECT,
        environment: 'sandbox',
        mode: 'single'
      });

      org.authenticate({ username: username, password: password, securityToken: securityToken }, function(err, resp) {
        let accomHistory;
        if(!err) {
          org.query({ query: `SELECT Start_Date__c, End_Date__c FROM Bedspace_Status__c WHERE Client__c IN (SELECT Id FROM Contact WHERE Contact.FirstName='Lucy')`}, function(err, res) {
            if(err) return console.error(err);
            else
            accomHistory = res.records[0]._fields;
            accomHistory = dateHelper.fixAccomDates(accomHistory);
            accomHistory.name = name;
            console.log('Accommodation History is: ', accomHistory);
            reply.view('data', accomHistory);
          });
        } else {
          console.log('Error: ' + err.message);
        }
      });
    }
    // }
};

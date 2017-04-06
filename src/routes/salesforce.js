const env = require('env2')('./config.env');
const authMiddleware = require('../helpers/authMiddleware.js');
const nforce = require('nforce');
const hapi = require('hapi');
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
      const org = nforce.createConnection({
        clientId: process.env.SALESFORCE_KEY,
        clientSecret: process.env.SALESFORCE_SECRET,
        redirectUri: process.env.SF_REDIRECT,
        environment: 'sandbox',
        mode: 'single'
      });

      org.authenticate({ username: username, password: password, securityToken: securityToken }, function(err, resp) {
        if(!err) {
          org.query({ query: `SELECT Start_Date__c, End_Date__c FROM Bedspace_Status__c WHERE Client__c IN (SELECT Id FROM Contact WHERE Contact.FirstName='Andy')`}, function(err, res) {
            if(err) return console.error(err);
            else
            console.log(res.records[0]._fields);
            return reply.view('data', res.records[0]._fields);
          });
        } else {
          console.log('Error: ' + err.message);
        }
      });
    }
    // }
};

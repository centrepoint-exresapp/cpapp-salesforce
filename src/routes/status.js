const authMiddleware = require('../helpers/authMiddleware.js')
const requestTable = require('../database/tables/requests.js')
const errorMessages = require('../constants/errorMessages.js');

module.exports = {
  method: 'GET',
  path:'/status',
  config: {
    auth: {
      strategy: 'base'
    },
    pre: [
        { method: authMiddleware, assign: 'user' }
    ],
    handler: (req, reply) => {
      let request = {
        id: req.query.id,
        status: req.query.status
      };
      requestTable.updateStatus(request, function (err, data) {
        if (err) {
          return reply.view('error', {
            error: errorMessages.databaseError
          });
        }
        reply.redirect('/dashboard');
      });
    }
  }
};

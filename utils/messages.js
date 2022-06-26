const moment = require('moment');

const formMessage = (username, text) => ({
  username, text, time: moment().format('h:mm a')
});

module.exports = formMessage;
const moment = require('moment');
function formatMessage (recipient,sender,text) {
    return {
        recipient,
        sender,
        text,
        time: moment().format('h:mm a')
    }
}

module.exports = formatMessage;
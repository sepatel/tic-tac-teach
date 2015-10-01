var Services = require('./services');

module.exports = function(ws) {
  ws.on('message', function incoming(message) {
    try {
      message = JSON.parse(message);
    } catch (e) {
      console.error("Unable to format", message, e);
    }
    if (message.event && Services[message.event]) {
      Services[message.event](message.data).then(function(response) {
        if (response) {
          sendMessage(ws, message.event, response);
        }
      }).catch(function(error) {
        sendMessage(ws, "error", {code: 'serverError', message: 'Unable to process message', message: message, error: error});
      });
    } else {
      sendMessage(ws, "error", {code: "unknownCommand", message: message});
    }
  });
};

function sendMessage(ws, event, payload) {
  ws.send(JSON.stringify({event: event, data: payload}), function(error) {
    if (error) {
      console.error("Error sending message", payload, error);
    }
  });
}


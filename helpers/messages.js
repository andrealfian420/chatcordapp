const { format } = require('date-fns');

function formatMessage(username, text) {
  const currentTimeZoneTime = new Date();

  // The heroku's server is gmt +0, so add the time by 7 hours (GMT +7)
  const jakartaTime = currentTimeZoneTime.setHours(
    currentTimeZoneTime.getHours() + 7
  );

  return {
    username,
    text,
    time: format(jakartaTime, 'h:mm a'),
  };
}

module.exports = formatMessage;

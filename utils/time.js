const dayjs = require('dayjs');

const utc =
  require('dayjs/plugin/utc');

const timezone =
  require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const JST = 'Asia/Tokyo';

function nowJST() {

  return dayjs().tz(JST);
}

function parseJST(datetime) {

  return dayjs.tz(
    datetime,
    JST
  );
}

module.exports = {
  nowJST,
  parseJST,
  JST
};

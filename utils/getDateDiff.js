/**
 * 计算过去时间
 */
var getDateDiff = function (timestamp) {

  // 服务器返回的时间有时单位是秒，要转换成毫秒
  if (timestamp.toString().length < 13) {
    timestamp *= 1000;
  }

  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var month = day * 30;
  var year = month * 12;

  // 当前时间
  var nowDate = new Date();
  var nowTimestamp = nowDate.getTime();
  // 创建时间
  var createDate = new Date(parseInt(timestamp));
  // 时间差
  var diffValue = nowTimestamp - timestamp;

  var hourC = diffValue / hour;
  var yearC = diffValue / year;
  // var dayC = diffValue / day;
  // var monthC = diffValue / month;
  // var weekC = diffValue / (7 * day);
  // var minC = diffValue / minute;
  var result = '';

  if (hourC <= 1) {
    result = createDate.getHours() + ':' + createDate.getMinutes() + ':' + createDate.getSeconds();
  } else if (hourC < 24) {
    result = parseInt(hourC, 10) + '小时前';
  } else if (hourC <= 48) {
    result = '昨天';
  } else if (hourC <= 72) {
    result = '前天';
  } else if (hourC > 72 && yearC < 1) {
    result = (createDate.getMonth() + 1) + '-' + createDate.getDate();
  } else {
    result = createDate.getFullYear() + '-' + (createDate.getMonth() + 1) + '-' + createDate.getDate();
  }

  return result;
};

module.exports = getDateDiff;
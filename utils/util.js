var config = require("../config.js")

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 根据ele api返回的imghash值，转换成正确的图片路径
// 比如：返回的imghash值是9b9c8e482821be2080edcffbb3a8d376png
// 处理后则返回http://fuss10.elemecdn.com/9/b9/c8e482821be2080edcffbb3a8d376png.png
function formatImage(imghash) {
  // console.log(imghash);
  if (!imghash) {
    return "";
  }
  var s1 = imghash.slice(0, 1); // 截取第1个字符 比如： 9
  var s2 = imghash.slice(1, 3); // 截取第2-3个字符 比如： b9
  var s3 = imghash.slice(3);    // 截取从第3个字符后的所有字符 比如：c8e482821be2080edcffbb3a8d376png
  var s4 = imghash.slice(32);   // 截取从第32个字符后的所有字符，取图片后缀名, 比如： png
  return `${config.imgHost}/${s1}/${s2}/${s3}.${s4}`;
}

// 用来处理天气温度，在温度数值后添加°符号
function formatTemperature(temperature) {
  if (!temperature) {
    return "";
  }
  return temperature + "°";
}

module.exports = {
  formatTime: formatTime,
  formatImage: formatImage,
  formatTemperature: formatTemperature
}

/**
 * 小程序配置文件
 */

// 定义API服务器，图片服务器，主域名
var host = "https://mainsite-restapi.ele.me"
var imgHost = "https://fuss10.elemecdn.com"
var domain = "https://www.ele.me"

// 配置纬度，经度
var latitude = 34.749779
var longitude = 113.651146

var config = {
  host,
  imgHost,
  domain,

  latitude,
  longitude,

  // 以下是要访问的各种接口：
  geo: `${host}/bgs/poi/reverse_geo_coding`,
  entries: `${host}/shopping/openapi/entries`,
  restaurants: `${host}/shopping/v3/restaurants`
  
};

module.exports = config

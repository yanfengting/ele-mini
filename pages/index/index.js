//index.js
const app = getApp()
var config = require('../../config.js')
var util = require('../../utils/util.js')

Page({
  data: {
    inputShowed: false,
    inputVal: "",
    // 用户位置信息
    position: {},
    // 天气信息
    weather: {},
    // 新用户专享，推广
    promotion: {},
    // 轮播图
    entries: [],
    // 品质套餐
    svip: {},
    // 限量抢购
    favourable: {}
  },
  onLoad: function () {
    // 获取用户位置
    this.getPosition();
    // 获取天气信息
    this.getWeather();
    // 获取推荐信息
    this.getPromotion()
    // 获取轮播图，品质套餐，限量抢购
    this.getEntries()
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  // 获取用户位置
  getPosition: function () {
    var that = this
    wx.request({
      url: config.geo,
      data: {
        latitude: config.latitude,
        longitude: config.longitude
      },
      success: function (res) {
        // console.log(res)
        res.data.address_short = `${res.data.address.substring(0, 15)}...`
        that.setData({
          position: res.data
        });
        // console.log(that.data.position)
      }
    })
  },
  // 获取天气信息
  getWeather: function () {
    var self = this
    wx.request({
      url: config.weather,
      data: {
        latitude: config.latitude,
        longitude: config.longitude
      },
      success: function (res) {
        // console.log(res.data)
        res.data.image_hash = util.formatImage(res.data.image_hash)
        res.data.temperature = util.formatTemperature(res.data.temperature)
        self.setData({
          weather: res.data
        });
      }
    })
  },
  // 获取推广信息
  getPromotion: function () {
    var that = this;
    wx.request({
      url: config.promotion,
      data: {
        latitude: config.latitude,
        longitude: config.longitude,
        templates: ["big_sale_promotion_template"]
      },
      success: function (res) {
        console.log(res.data)
        res.data.forEach(function (item) {
          item.entries.forEach(function (entry) {
            entry.image_hash = util.formatImage(entry.image_hash);
          })
        })
        that.setData({
          promotion: res.data[0].entries[0]
        })
        // console.log(that.data.promotion)
      }
    })
  },
  // 获取轮播图
  getEntries: function () {
    var that = this;
    wx.request({
      url: config.entries,
      data: {
        latitude: config.latitude,
        longitude: config.longitude,
        templates: ["main_template", "favourable_template", "svip_template"]
      },
      success: function (res) {
        console.log(res.data)
        res.data.forEach(function (item) {
          item.entries.forEach(function (entry) {
            entry.image_hash = util.formatImage(entry.image_hash);
          })
        })
        var swiper = res.data[0];
        var group1 = swiper.entries.filter(function (v, i) {
          return i > 0 && i <= 10;
        })
        var group2 = swiper.entries.filter(function (v, i) {
          return i >= 10;
        })
        that.setData({
          entries: [group1, group2],
          favourable: res.data[1].entries[0]
        })
      }
    })
  }
})
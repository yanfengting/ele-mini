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
    promotion: [],
    // 轮播图
    entries: [],
    // 品质套餐
    svip: {},
    // 限量抢购
    favourable: {},
    // 推荐(未请求接口)
    recommand: [{
      title: "品质套餐",
      tip: "搭配齐全吃得好",
      img: "https://fuss10.elemecdn.com/d/d4/16ff085900d62b8d60fa7e9c6b65dpng.png?imageMogr/format/webp/thumbnail/!240x160r/gravity/Center/crop/240x160/",
      popularity: 0
    }, {
      title: "限量抢购",
      tip: "超值美味9.9元起",
      img: "https://fuss10.elemecdn.com/b/e1/0fa0ed514c093a7138b0b9a50d61fpng.png?imageMogr/format/webp/thumbnail/!240x160r/gravity/Center/crop/240x160/",
      popularity: 711
    }],
    // 商家列表
    restaurants: [],
    // 偏移量，即第几页
    offset: 0,
    // 限制个数，即每页显示的个数
    limit: 8
  },
  onLoad: function() {
    // 获取用户位置
    this.getPosition();
    // 获取天气信息
    this.getWeather();
    // 获取推荐信息
    this.getPromotion()
    // 获取轮播图，品质套餐，限量抢购
    this.getEntries()
    // 获取商家列表，第一次进入取8条
    this.getRestaurants()
  },
  // 上拉触底，会根据app.json中"onReachBottomDistance": 60来判断是否触底。
  onReachBottom: function() {
    this.setData({
      offset: this.data.restaurants.length / this.data.limit
    })
    wx.showLoading()
    this.getRestaurants()
  },
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  // 获取用户位置
  getPosition: function() {
    var that = this
    wx.request({
      url: config.geo,
      data: {
        latitude: config.latitude,
        longitude: config.longitude
      },
      success: function(res) {
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
  getWeather: function() {
    var self = this
    wx.request({
      url: config.weather,
      data: {
        latitude: config.latitude,
        longitude: config.longitude
      },
      success: function(res) {
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
  getPromotion: function() {
    var that = this;
    wx.request({
      url: config.promotion,
      data: {
        latitude: config.latitude,
        longitude: config.longitude,
        templates: ["big_sale_promotion_template"]
      },
      success: function(res) {
        // console.log(res.data)
        res.data.forEach(function(item) {
          item.entries.forEach(function(entry) {
            entry.image_hash = util.formatImage(entry.image_hash);
          })
        })
        that.setData({
          promotion: res.data[0].entries
        })
        // console.log(that.data.promotion)
      }
    })
  },
  // 获取轮播图
  getEntries: function() {
    var that = this;
    wx.request({
      url: config.entries,
      data: {
        latitude: config.latitude,
        longitude: config.longitude,
        templates: ["main_template", "favourable_template", "svip_template"]
      },
      success: function(res) {
        // console.log(res.data)
        res.data.forEach(function(item) {
          item.entries.forEach(function(entry) {
            entry.image_hash = util.formatImage(entry.image_hash);
          })
        })
        var swiper = res.data[0];
        var group1 = swiper.entries.filter(function(v, i) {
          return i > 0 && i <= 10;
        })
        var group2 = swiper.entries.filter(function(v, i) {
          return i >= 10;
        })
        that.setData({
          entries: [group1, group2],
          favourable: res.data[1].entries[0]
        })
      }
    })
  },
  // 获取商家列表信息
  getRestaurants: function() {
    var that = this
    wx.request({
      url: config.restaurants,
      data: {
        latitude: config.latitude,
        longitude: config.longitude,
        offset: that.data.offset,
        limit: that.data.limit,
        'extras[]': 'activities',
        'extra_filters': 'home',
        'terminal': 'h5'
      },
      success: function(res) {
        // console.log(res.data)
        var restaurants = res.data.items.map(function(item) {
          item.restaurant.image_path = util.formatImage(item.restaurant.image_path);
          item.restaurant.distance = util.formatDistance(item.restaurant.distance);
          return item;
        })
        // 与原来的数组restaurants连接形成新数组
        that.setData({
          restaurants: that.data.restaurants.concat(restaurants)
        });
        wx.hideLoading()
        // console.log(that.data.restaurants);
      }
    })
  }
})
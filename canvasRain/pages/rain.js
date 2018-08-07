// pages/rain.js
const { createRainAnimation, isRain } = require('./utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const weatherInfo = {
      weather: '中雨',
      wind: '0级',
    };
    if (isRain(weatherInfo.weather)) {
      createRainAnimation(weatherInfo.weather, weatherInfo.wind);
    }
  },
})
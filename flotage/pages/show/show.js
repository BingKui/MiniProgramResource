// page/index/index.js
const {
  moveArray,
  randomArray,
} = require('./utils.js');
const fps = 60;
let floatData = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fontItems: [],
    title: '',
    content: '',
    key: 22,
    showShareBtn: false,
    imageFiles: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    const urls = [
      'http://image.uiseed.cn/tmp_10dfdc04bf30260442cceb3b104dadba.jpg',
      'http://image.uiseed.cn/tmp_64abf8a1980d2b087f39a904ae6e6a70.jpg',
      'http://image.uiseed.cn/tmp_9422eee81c530da37aadfbeabe96d696.jpg',
      'http://image.uiseed.cn/tmp_b8a191bf68f0ce769ba6fb23b8e81352.jpg',
    ];
    this.setData({
      title: "漂浮物",
      key: 22,
      showShareBtn: options.type === '1' ? true : false,
      imageFiles: urls,
    });
    const url = 'http://image.uiseed.cn/icon/%E7%AC%91.png';
    floatData = randomArray(url, 21);
    const that = this;
    // 获取 canvas 对象
    const ctx = wx.createCanvasContext('background');
    for (let i = 0; i < floatData.length; i++) {
      const item = floatData[i];
      ctx.drawImage(item.url, item.x, item.y, item.w, item.h);
    }
    ctx.draw();
    const drawImg = () => {
      floatData = moveArray(floatData);
      for (let j = 0; j < floatData.length; j++) {
        const one = floatData[j];
        ctx.drawImage(one.url, one.x, one.y, one.w, one.h);
      }
      ctx.draw();
    };
    this.canvasTimer = setInterval(() => {
      drawImg()
    }, 1000 / fps);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (option) {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // 清楚时间监听器
    clearInterval(this.canvasTimer);
    clearInterval(this.timer);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const { imageFiles, key, title } = this.data;
    const urls = JSON.stringify(imageFiles);
    return {
      title,
      path: `/page/animation/show/show?key=${key}&imageFiles=${urls}&title=${title}&type=2`
    }
  }
})
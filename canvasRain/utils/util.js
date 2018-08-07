// 返回页面大小对象
const windowSize = () => {
  let maxObj;
  try {
      const sysInfo = wx.getSystemInfoSync();
      maxObj = {
          width: sysInfo.windowWidth,
          height: sysInfo.windowHeight
      };
  } catch (err) {
      maxObj = {
          width: 375,
          height: 603
      };
  }
  return maxObj;
}

module.exports = windowSize;
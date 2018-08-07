// 下雨效果的
const windowSize = require('../utils/util.js');
const canvasEl = {
    width: windowSize().width * 2,
    height: windowSize().height
}

/**
 * 创建下雨动画
 * @param {String} type 下雨动画的类型，用来生成雨滴的数量、大小、是否有闪电等
 */
const createRainAnimation = (type, wind) => {
    // 获取对象
    const ctx = wx.createCanvasContext('weatherAnimation');
    const rainInfo = getRainInfo(type);
    // 帧率，每秒执行的次数
    const fps = 360;
    // 存放所有的雨滴
    const rainList = [];
    // 每次增加的雨滴数，根据雨的大小不同
    const addNum = rainInfo.num;
    // 雨滴的偏移量，根据风力大小不同
    const offSet = 0 - getWindLeval(wind);
    const timeInterval = setInterval(() => {
        for (let i = 0; i < addNum; i++) {
            // 调用 createRainLine 函数，参数是雨滴x坐标
            const rainTemp = createRainLine(Math.random() * 2 * canvasEl.width - (0.5 * canvasEl.width));
            rainList.push(rainTemp);
        }
        rainList.forEach((item) => {
            updateRainItem(item, offSet);
        });
        // 删除 die属性为ture 的数组成员
        for (var i = rainList.length - 1; i >= 0; i--) {
            if (rainList[i].die) {
                rainList.splice(i, 1);
            }
        }
        ctx.lineWidth = 2;
        rainList.forEach((item) => {
            ctx.strokeStyle = item.color;
            ctx.beginPath();
            ctx.moveTo(item.posx, item.posy);
            ctx.lineTo(item.posx + item.h * offSet, item.posy + item.h);
            ctx.stroke();
        });
        ctx.draw();
    }, 1000 / fps);
    return timeInterval;
}

const rainTypeArr = ["阵雨", "雷阵雨", "雷阵雨伴有冰雹", "小雨",
"中雨", "大雨", "暴雨", "大暴雨", "特大暴雨", "小雨转中雨",
"中雨转大雨", "大雨转暴雨", "暴雨转大暴雨", "大暴雨转特大暴雨"]

/**
 * 根据天气信息返回雨天下标
 * @param {String} text 天气详情
 */
const rainTypeIndex = (text) => {
    if (isRain(text)) {
        return rainTypeArr.indexOf(text);
    }
    return false;
}

/**
 * 判断是否是雨天
 * @param {String} text 天气详情
 */
const isRain = (text) => {
    return rainTypeArr.indexOf(text) > -1;
}

/**
 * 根据天气信息返回雨滴的详情
 * @param {String} text 天气详情
 */
const getRainInfo = (text) => {
    const index = rainTypeIndex(text);
    let numArr = [1, 2, 3, 1, 3, 5, 13, 18, 25, 3, 5, 7, 10, 14];
    return {
        num: numArr[index],
    };
}

const getWindLeval = (wind) => {
    const arr = ['无', '微', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    const numArr = [0, 0.05, 0.1, 0.15, 0.2, 0.3, 0.5, 0.9, 1.3, 1.8, 2.6, 3.5, 4.2, 6];
    let result = 0;
    for (let i = 0; i < arr.length; i++) {
        if (wind.indexOf(arr[i]) > -1) {
            result = numArr[i];
            break;
        }
    };
    return result;
}

const createRainLine = (width) => {
    const x = Math.random() * 2 * width - (0.5 * width);
    // 随机生成雨滴的长度
    const len = 0.25 * (50 + Math.random() * 100);
    // 生成一个雨滴
    const line = {
        // 雨滴下落速度  
        speed: 3.5 * (Math.random() * 6 + 3),
        // 判断是否删除，值为true就删除
        die: false,
        // 雨滴x坐标 
        posx: x,
        // 雨滴y坐标 
        posy: -50,
        // 雨滴的长度
        h: len,
        // 雨滴的颜色
        color: getRgb(Math.floor(len * 255 / 75), Math.floor(len * 255 / 75), Math.floor(len * 255 / 75))
    };
    // 返回雨滴
    return line;
}

const updateRainItem = (item, offSet) => {
    // 判断雨滴是否已经不再显示范围，不再设置删除
    const x_flag = item.posx >= canvasEl.width + 20;
    const y_flag = item.posy >= canvasEl.height + 20;
    if (x_flag || y_flag) {
        item.die = true;
    } else {
        item.posx = item.posx + item.speed + offSet;
        item.posy += item.speed;
    }
    return item;
}

// 根据参数，返回一个rgb颜色，用于给雨滴设置颜色
const getRgb = (r, g, b) => {
    return "rgb(" + r + "," + g + "," + b + ")";
}

module.exports = {
    isRain,
    createRainAnimation,
};
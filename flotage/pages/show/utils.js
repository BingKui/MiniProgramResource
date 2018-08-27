// 随机生成一个长度大小为 10-15 的数组，保存数据
// 每个对象包含一个 url，x，y
// 然后执行循环方法，修改x，y，保持下坠，并能够左右晃动
// 当 y > 屏幕可见， 删除随机 重置 y 为 -100 随机生成 x
// 再执行下坠方法

// 文字动画
// 分割一句话的每个字，生成对象
// 每个对象包含，文字，样式（颜色， 大小，旋转）、位置，是否显示
// 根据字数判断来生成的坐标位置、和相应的字体大小

/**
 * 通过传入一个数字，返回两个数字， 两个数字的乘 必须大于等于传入的数字，且相距最小
 * 如 传入 17 返回（min=4，max=5）
 * @param {Number} num 需要拆解的数字
 */
const numberToObject = (num) => {
  let max = 0;
  let last_num = 0;
  while (true) {
    const flag_now = Math.pow(max, 2) >= num;
    const flag_last = Math.pow(last_num, 2) < num;
    if (flag_now && flag_last) {
      break
    }
    last_num = max;
    max++;
  }
  const {
    result,
    diff_arr
  } = returnArr(max, num);
  const {
    i,
    j
  } = result[getMinIndex(diff_arr)];
  let short = i;
  let long = j;
  if (i > j) {
    short = j;
    long = i;
  }
  return {
    short,
    long,
  }
}

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

const maxObj = windowSize();

const createPosition = () => {}

const randomPosition = (len, index) => {
    const {
        short,
        long
    } = numberToObject(len);
    // 基础单元格宽度
    const baseWidth = maxObj.width / long;
    // 基础单元格高度
    const baseHeight = maxObj.height / short;
    // 横轴偏移基数
    const remainder = index % long;
    // 纵轴偏移基数
    const times = Math.floor(index / long);

    const space_min_width = baseWidth / 4;
    const space_max_width = baseWidth / 3;
    const space_min_height = baseHeight / 4;
    const space_max_height = baseHeight / 3;

    const x = randomNum(baseWidth * remainder + space_min_width, baseWidth * remainder + space_max_width);
    const y = randomNum(baseHeight * times + space_min_height, baseHeight * times + space_max_height);
    return {
        x,
        y
    }
}

const randomFontSize = (len) => {
    const {
        short,
        long
    } = numberToObject(len);
    const baseWidth = maxObj.width / long;
    const baseHeight = maxObj.height / short;
    const base = Math.min(baseHeight, baseWidth) / 2;
    return base;
}

const randomFontItem = (text, len, index) => {
    const position = randomPosition(len, index);
    return {
        text,
        show: false,
        style: `color:#6675FB;font-size:${randomFontSize(len)}px;transform:rotate(10deg);top:${position.y}px;left:${position.x}px;`
    };
}

const dealContent = (content = '') => {
    const arr = content.split('');
    const len = content.length;
    return arr.map((item, index) => randomFontItem(item, len, index));
}

const randomArray = (url, len = 10) => {
    const result = [];
    for (let i = 0; i < len; i++) {
        result.push(randomItem(url));
    }
    return result;
}

const randomItem = (url) => {

    const x = randomNum(0, maxObj.width);
    const y = randomNum(0, maxObj.height);
    const size = randomNum(15, 40);
    const speed = getSpeed();
    const shake = getShake();
    return {
        url,
        x,
        y,
        w: size,
        h: size,
        speed,
        shake,
    };
};

// 随机生成一个区间的数字
const randomNum = (start, end) => {
    const muit = end - start;
    return Math.round(Math.random() * muit + start)
}

const moveItem = (item) => {
    if (item.y < maxObj.height) {
        item.x += item.shake;
        item.y += item.speed;
    } else {
        item.x = randomNum(0, maxObj.width);
        item.y = -50;
        item.shake = getShake();
    }
    return item;
}

const moveArray = (arr) => {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        const item = moveItem(arr[i])
        result.push(item);
    }
    return result;
}

// 生成一个合适的速度
const getSpeed = () => {
    let speed = Math.random();
    if (speed < 0.5 || speed > 0.7) {
        speed = getSpeed();
    }
    return speed;
}

// 获取一个漂浮量
const getShake = () => {
    const item = getSpeed() / 5;
    return Math.random() > 0.5 ? item : -item;
}

module.exports = {
    randomItem,
    randomArray,
    moveArray,
    moveItem,
    dealContent,
}
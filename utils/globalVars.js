/**
 * 全局参数
 */

var globalVars = {
  // 调试状态
  debug: true,
  // 域名
  apiDomain: 'https://woniuji.cn',
  // 分享数据
  shareTitle: '蜗牛记-让世界看到你的坚持',
  // 阿里云配置
  aliyun: {
    ossDomain: 'https://woniuji.oss-cn-beijing.aliyuncs.com',
    accessId: 'LTAIl5UNqurg8OhY',
    accessKey: '7uM9TQcJ6Rx5MYgQCmC4WmKHT1G41w',
    maxSize: 1024*1024*10
  }
};

if(globalVars.debug) {
  globalVars.apiDomain = 'http://local.woniuji.cn:8001';
}

module.exports = globalVars;
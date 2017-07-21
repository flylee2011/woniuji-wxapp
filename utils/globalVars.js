/**
 * 全局配置
 */
var globalVars = {
  // 调试状态
  debug: false,
  // 域名
  apiDomain: 'http://woniuji.cn:1426',
  // 每页条数
  listPageSize: 10,
  // 分享数据
  shareTitle: '蜗牛记-让世界看到你的坚持',
  // 阿里云配置
  aliyun: {
    ossDomain: 'https://woniuji.oss-cn-beijing.aliyuncs.com',
    accessId: 'LTAIl5UNqurg8OhY',
    accessKey: '7uM9TQcJ6Rx5MYgQCmC4WmKHT1G41w',
    maxSize: 1024*1024*10
  },
  // 图片处理规则
  imgRule: {
    w100: '!w100',
    w200: '!w200',
    w400: '!w400'
  }
};

if(globalVars.debug) {
  globalVars.apiDomain = 'http://local.woniuji.cn:8001';
}

module.exports = globalVars;
const path = require('path');
const debug = process.env.NODE_ENV !== 'production';

const env = "prod";
const link = {
    dev: "http://192.168.2.146:8081",
    prod: "http://hongkou.jkainfo.com/pc"
}[env];


module.exports = {
    // outputDir: 'dist', // 构建输出目录
    // assetsDir: 'static', // 静态资源目录 (js, css, img, fonts)
    publicPath: './',
    devServer: {
        open: true,
        https: false,
        hotOnly: false,
        proxy: {
            '/pc': {
                target: link,
                ws: false,
                changOrigin: true,
                pathRewrite: {
                    '^/pc': ''//这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
                }
            }
        },
        before: app => {
        }
    }
};

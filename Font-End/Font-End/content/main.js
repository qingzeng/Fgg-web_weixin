require.config({
    baseUrl: "content/lib",
    paths: {
        'angular': 'angular/angular.min',
        'angular-route': 'angular/angular-route.min',
        'angularAMD': 'angular/angularAMD.min',
        'async': 'require/async',
        'css': 'require/css.min',
        'jquery': 'jquery/jquery-1.8.2.min',
        //layer
        '_layer': 'layer/layer.m',
        'dialog': 'helper/dialogHelper',
        //echarts表格
        'echarts': 'echarts/echarts-map',
        'echarts/chart/line': 'echarts/echarts-map',
        'echarts_config': 'echarts/config',
        //validate
        'jValidate': 'validate/jquery.validate.min',
        'jValidateexpand': 'validate/validateExpand',
        'autocomplete': 'autocomplete/jquery.autocomplete',
        //工具服务类
        'handler': 'helper/Helper',
        //swipe触摸滑动
        'swipe': 'swipe/swipe',
        'baidu-map': 'helper/Bmap',
        'jweixin': 'http://res.wx.qq.com/open/js/jweixin-1.0.0',
        'jweixin.config': 'helper/wechat',
        '_swipe':'swipe/jquery.swipe',
        'kevin_swipe':'swipe/swiper-3.2.7.jquery.min'
    },
    shim: {
        'angularAMD': ['angular'],
        'angular-route': ['angular'],
        'jValidate': ['jquery'],
        'jValidateexpand': ['jValidate'],
        'echarts': {
            deps: ['echarts_config']
        },
        'autocomplete': {
            deps: ['jquery']
        },
        '_layer': {
            deps: ['jquery']
        },
        'handler': {
            deps: ['jquery']
        },
        'swipe': {
            deps: ['jquery']
        },
        'jweixin.config': {
            exports: 'jweixin'
        },
        '_swipe': {
            exports: 'jquery'
        },
        'kevin_swipe':{
            exports: 'jquery'
        }
    },
    deps: ['css!../css/weui.min', 'css!../css/example','css!../css/swiper-3.2.7.min', 'css!../css/style', 'app']

});
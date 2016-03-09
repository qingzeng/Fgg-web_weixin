require.config({
    baseUrl: "content/lib",
    paths: {
        'angular': 'angular/angular.min',
        'angular-route': 'angular/angular-route.min',
        'angularAMD': 'angular/angularAMD.min',
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
        'jweixin': 'http://res.wx.qq.com/open/js/jweixin-1.0.0',
        'jweixin.config': 'helper/wechat',
        '_swipe':'swipe/jquery.swipe'
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
        'jweixin.config': {
            exports: 'jweixin'
        },
        '_swipe': {
            exports: 'jquery'
        }
    },
    deps: ['css!../css/weui.min', 'css!../css/example', 'app']

});
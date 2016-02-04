//辅助类名称
"use strict";
define(['jquery'], function ($) {
    var handler = handler || {};
    window.handler = handler;
    handler.redirectUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4c921279399e1337&redirect_uri=" + "http%3a%2f%2ffggFinanceWebTest.yunfangdata.com%2fFont-End%2f%23%2flogin" + "&response_type=code&scope=snsapi_base&connect_redirect=1#wechat_redirect";//外网测试版链接地址
    //handler.rootUrl = "http://fggwechat.yunfangdata.com:10086";
    //handler.rootUrl = "http://192.168.14.35:8089/fgg_GoldWeChat";
    handler.rootUrl = "http://fggFinanceApiTest.yunfangdata.com";//外网测试版接口地址
    //handler.bdMapUrl = "http://localhost:8058/Font-End/bdMap.html";
    handler.bdMapUrl = "http://fggFinanceWebTest.yunfangdata.com/bdMap.html";//外网测试版地址
    handler.netErrorMsg = "网络异常，请稍后再试！";
    handler.setTitle = function (str) {
        var $body = $('body');
        document.title = str;
        var $iframe = $('<iframe src="#/home"></iframe>');
        $iframe.on('load', function () {
            setTimeout(function () {
                $iframe.off('load').remove();
            }, 0);
        }).appendTo($body);
    };

    handler.KeHuIDIsNull = function () {
        if (window.localStorage.getItem("keHuId") == "" || window.localStorage.getItem("keHuId") == null || window.localStorage.getItem("keHuId") == "null" || window.localStorage.getItem("keHuId") == undefined || window.localStorage.getItem("keHuId") == "undefined") {
            return true;
        } else {
            return false;
        }
    };

    //判断客户ID是否存在
    handler.isKeHuID = function (_callback) {
        if (window.localStorage.getItem("keHuId") == "" || window.localStorage.getItem("keHuId") == null || window.localStorage.getItem("keHuId") == "null" || window.localStorage.getItem("keHuId") == undefined || window.localStorage.getItem("keHuId") == "undefined") {
            window.location.href = handler.redirectUrl;
        } else {
            (_callback && typeof (_callback) === "function") && _callback();

            //判断客户信息，如果客户id和openid不一致则清空客户id
            var timestamp = Math.random();//随机数
            var UrlCheck = handler.rootUrl + "/webservice/getUserInfo?keHuId=" + window.localStorage.getItem("keHuId") + "&radom=" + timestamp;
            $.get(UrlCheck, function (data) {
                //alert("客户id=" + window.localStorage.getItem("keHuId") + "--openid=" + window.localStorage.getItem("openid") + "id重置=" + JSON.stringify(data));
                if (data.code == 200) {
                    var openid = data.data.openid;
                    if (openid != window.localStorage.getItem("openid")) {
                        alert("客户已在其它处登陆，请重新登陆!");
                        window.localStorage.setItem("keHuId", null);
                        window.location.href = "#/login";
                    }
                }
            });
        }
    };



    return handler;
});

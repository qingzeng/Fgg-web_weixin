
define(['jweixin', 'handler', 'jquery'], function (wx, handler, $) {
    //  alert(wx)
    var _wx = wx;
    // alert($);

    //alert(window.location.href);
    setcode();
    var WxData;
    function setcode() {
        var timestamp = Math.random();
        var lurl = window.location.href;
        var Url = handler.rootUrl + '/webservice/getWechatTicket?url=' + lurl + "&radom=" + timestamp;
        $.ajax({
            url: Url,
            async: false,
            dataType: "json",
            success: function (data) {
                if (data.code == 200) {
                    //alert(.appId);
                    WxData = data.data;
                }
                else {
                    alert("网络请求异常");
                }
            }
        });
    }

    _wx.config({
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: WxData.appId, // 必填，公众号的唯一标识
        timestamp: WxData.timesTamp, // 必填，生成签名的时间戳
        nonceStr: WxData.nonceStr, // 必填，生成签名的随机串
        signature: WxData.signaTure,// 必填，签名，见附录1
        jsApiList: [
            'scanQRCode',
            'closeWindow'
        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });

    wx.error(function (res) {
        alert("res:"+res);
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。

    });
    return _wx;
});

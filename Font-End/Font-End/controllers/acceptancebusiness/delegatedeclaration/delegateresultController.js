/**
 * delegatedeclaration/委托报单结果页面
 */
define(['app', 'jquery', 'handler'], function(app, $, handler) {
    handler.setTitle("报单结果");
    app.controller('DelegatedeclarationCtrl', function($scope) {
        $scope.resultnum = getParameterByName("reportNum");
        $scope.submittime = getParameterByName("submittime");
        $("#loadingToast").show();
        time();
        setTimeout("submithref()", 5000);
    });
});
//获取URL参数
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.href);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function submithref() {
    time();
    window.location.href = "#/alldeclarations"
}
var wait = 5;
function time() {
    var t = setInterval(function() {
        $("#seconds").text(wait);
        wait--;
        $("#seconds").text(wait);
        if (wait == 0) {
            clearInterval(t);
            wait = 5;
        }
    }, 1000)
}

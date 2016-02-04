/**
 * Created by Kevin on 2016/1/8.
 * 报单记录Services
 */
"use strict";
define(['handler'], function(handler) {
    var declarationServices = angular.module('declarationServices', []);

    declarationServices.factory('declarationServices', function($http, $q, $timeout) {
        //http://192.168.14.35:8089/fgg_GoldWeChat-webapp/webservice/FindByTypeCommissionedEvaluation?
        //var rootUrl = "http://192.168.14.35:8089/fgg_GoldWeChat/webservice/"; //handler.rootUrl;
        var rootUrl = handler.rootUrl;
        var cityName = window.localStorage.getItem("cityName");
        var keHuId = window.localStorage.getItem("keHuId");
        /***
         * 获取报单记录
         * @param from
         * @returns {*}
         */
        var getDeclarationInfo = function(from) {
            var params = {
                keHuId: keHuId, //fde87e4b9fd142b6b51e382b7700745a',//keHuId,
                cityName: cityName, //'shanghai',//cityName
                type: from.type,
                pageIndex: from.pageIndex,
                pageSize: from.pageSize,
            };
            return $http({
                method: 'get',
                params: params,
                url: rootUrl + '/webservice/FindByTypeCommissionedEvaluation'
                    //
            });
        };

        /***
         * 获取进度详情
         * @param from
         * @returns {*}
         */
        var findCommissionedEvaluation = function(from) {
                var params = {
                    reportNum: from.reportNum, //'538440697949',
                    cityName: cityName //cityName
                };
                return $http({
                    method: 'GET',
                    params: params,
                    url: rootUrl + "/webservice/findcommissionedEvaluation"
                });
            }
            /**
             * 催单撤单接口
             */
        var editCommissionedEvaluation = function(from) {
            var params = {
                keHuId: keHuId, //'fde87e4b9fd142b6b51e382b7700745a',//keHuId,
                type: from.type,
                cityName: cityName, //'beijing',
                reportNum: from.reportNum //'557711508420'//
            };
            return $http({
                method: 'POST',
                params: params,
                url: rootUrl + '/webservice/EditCommissionedEvaluation'
            });
        }



        return {
            getDeclarationInfo: function(from) {
                return getDeclarationInfo(from);
            },
            findCommissionedEvaluation: function(from) {
                return findCommissionedEvaluation(from);
            },
            editCommissionedEvaluation: function(from) {
                return editCommissionedEvaluation(from);
            }
        }
    })

})
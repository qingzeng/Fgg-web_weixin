/*
 *消息列表模块
 *progressreportServices
 */
"use strict";
define(['handler'], function(handler) {
    var selectcaseServices = angular.module('selectcaseServices', []);
    selectcaseServices.factory('selectcaseServices',
        function($http, $q, $timeout) {
            var rootUrl = handler.rootUrl;

            /*
             *获取消息正文接口
             *param{}
            */
            var getMessage = function(xiaoXiId) {
                var params = {
                  xiaoXiId:xiaoXiId
                }
                return $http({
                    method: 'GET',
                    params: params,
                    url: rootUrl + '/webservice/getMessage'
                });
            };

            /*
             *获取消息列表接口
             *param{}
            */
            var getAllMessage = function(keHuId,pageIndex,pageSize) {
                var params = {
                  keHuId:keHuId,
                  pageIndex:pageIndex,
                  pageSize:pageSize
                }
                return $http({
                    method: 'GET',
                    params: params,
                    url: rootUrl + '/webservice/getAllMessage'
                });
            };

            /*
             *标记消息已读
             *param{}
            */
            var readMessage = function(xiaoXiIds) {

                var params = {
                  xiaoXiIds:xiaoXiIds
                }
                return $http({
                    method: 'GET',
                    params: params,
                    url: rootUrl + '/webservice/readMessage'
                });
            };

            /*
             *标记消息删除
             *param{}
            */
            var delMessage = function(xiaoXiIds) {
                var params = {
                  xiaoXiIds:xiaoXiIds
                }
                return $http({
                    method: 'GET',
                    params: params,
                    url: rootUrl + '/webservice/delMessage'
                });
            };
            return {
                getMessage : function(xiaoXiId) {
                    return getMessage(xiaoXiId);
                },
                getAllMessage : function(keHuId,pageIndex,pageSize) {
                    return getAllMessage(keHuId,pageIndex,pageSize);
                },
                readMessage : function(xiaoXiIds) {
                    return readMessage(xiaoXiIds);
                },
                delMessage : function(xiaoXiIds) {
                    return delMessage(xiaoXiIds);
                }
            }

        })
})

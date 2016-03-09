/**
 * selectcase1/消息列表
 */
var keHuId = window.localStorage.getItem("keHuId");
var cityName = window.localStorage.getItem("cityName");
define(['app', 'jquery', 'handler', '_swipe', '../../../services/myguesses/messagerecord/selectcaseServices'], function(app, $, handler, selectcaseServices) {
	app.controller('Selectcase1Ctrl', function($scope, selectcaseServices) {
		//设置界面标题
		handler.setTitle("消息记录");
		//判断用户是否登陆
		handler.isKeHuID();
		//initParam();
		//是否显示无数据提示
		$scope.norecord = true;
		//总页数
		$scope.pageTotal = 0;
		//当前页码
		$scope.pageIndex = 1;
		//当前页显示数量
		$scope.pageSize = 7;
		//是否显示提示框 true显示 false不显示
		$scope.commit = false;
		//弹出框标题
		$scope.commitTitle = "估宝宝提醒";
		//弹出框信息
		$scope.commitMsg = "";
		//弹出操作为删除还是标记读取 true为删除 false为标记读取
		$scope.deleteOrRead = true;
		//勾选的消息数量
		$scope.checkItemCount = 0;
		//勾选的消息
		$scope.checkItem = "";
		//消息列表
		$scope.recordlist = {};
		$(function(){
		getData($scope, selectcaseServices, $scope.pageIndex, $scope.pageSize);
		  $("#msglist").swipe({
				swipe: function(event, direction, distance, duration, fingerCount) {
				 
					if (direction == "left") {
						 
						if ($scope.pageIndex == $scope.pageTotal) {
							return;
						} else {
							$("#btnSelectAll").removeClass("btn-selected");
							$scope.pageIndex += 1;
							getData($scope, selectcaseServices, $scope.pageIndex, $scope.pageSize);
						}
					} else if (direction == "right") {
					 
						if ($scope.pageIndex == 1) {
							return;
						} else {
							$("#btnSelectAll").removeClass("btn-selected");
							$scope.pageIndex -= 1;
							getData($scope, selectcaseServices, $scope.pageIndex, $scope.pageSize);
						}
					}

				}
			});

		});
		//获取选择的消息编号
		function getSelectItem() {
			$scope.checkItem = "";
			$scope.checkItemCount = 0;
			var key = "checked";
			$(".icheckbox_square-orange").each(function() {
				if ($(this).attr("class").indexOf(key) != -1) {
					$scope.checkItem += $(this).attr("tag") + ","
					$scope.checkItemCount += 1;
				}
			})
			if ($scope.checkItem.length > 0) {
				$scope.checkItem = $scope.checkItem.substring(0, $scope.checkItem.length - 1)
			}
		}
		//全选
		$scope.selectAll = function() {
				var key = "btn-selected";
				if ($('#btnSelectAll').attr("class").indexOf(key) == -1) {
					$("input.icheckbox_square-orange").addClass("checked");
					$('#btnSelectAll').addClass(key);
				} else {
					$("input.icheckbox_square-orange").removeClass("checked");
					$('#btnSelectAll').removeClass(key);
				}
			}
			//标记删除
		$scope.deleteMsg = function() {
				//当前操作为删除
				$scope.deleteOrRead = true;
				//获取勾选的消息
				getSelectItem();
				//有消息
				if ($scope.checkItem.length > 0) {
					//显示确认和取消按钮
					dialogButtonOp(false);
					if ($scope.checkItemCount == $scope.pageSize) {
						$scope.commitMsg = "您是否确认删除全部消息记录？删除之后，不可恢复";
					} else {
						$scope.commitMsg = "您是否确认删除该消息记录？删除之后，不可恢复";
					}
				} else {
					//显示知道了按钮
					dialogButtonOp(true);
					$scope.commitMsg = "您至少需选择一个消息记录，才能进行删除操作";
				}
				//显示弹出框
				$scope.commit = true;
			}
			//标记读取
		$scope.read = function() {
				//当前操作为标记读取
				$scope.deleteOrRead = false;
				//获取勾选的消息
				getSelectItem();
				//有消息
				if ($scope.checkItem.length > 0) {
					var arry = [];
					arry = $scope.checkItem.split(",");
					for (var i = 0; i < $scope.items.length; i++) {
						var _obj = {};
						_obj = $scope.items[i];
						for (var j = 0; j < arry.length; j++) {
							if (_obj.xiaoXiId == arry[j] && _obj.xiaoXiZhuangTai == "已读") {
								dialogButtonOp(true);
								$scope.commitMsg = "您选中消息记录包含已读消息";
								$scope.commit = true;
								return false;
							}
						}
					}
					//显示确认和取消按钮
					dialogButtonOp(false);
					if ($scope.checkItemCount == $scope.pageSize) {
						$scope.commitMsg = "您是否确认将全部消息记录标记成已读？";
					} else {
						$scope.commitMsg = "您是否确认标记该消息记录为已读状态？标记之后，不可恢复";
					}
				} else {
					//显示知道了按钮
					dialogButtonOp(true);
					$scope.commitMsg = "您至少需选择一个消息记录，才能进行标记已读操作";
				}
				//显示弹出框
				$scope.commit = true;
			}
			//关闭弹出框
		$scope.commitCancel = function() {
				$scope.commit = false;
			}
			//确认操作
		$scope.commitConfirm = function() {
				//true表示为标记删除操作
				if ($scope.deleteOrRead) {
					selectcaseServices.delMessage($scope.checkItem).success(function(result, statue) {
						if (result.code == 200) {
							location.reload();
						}
					}).error(function(data, statue) {});
				} else { //false表示为标记读取操作
					selectcaseServices.readMessage($scope.checkItem).success(function(result, statue) {
						if (result.code == 200) {
							location.reload();
						}
					}).error(function(data, statue) {});
				}
				$scope.commit = false;
			}
			//格式化读取状态
		$scope.formatRead = function(concent) {
				return concent == "1" ? "已读" : "未读";
			}
			//格式化日期
		$scope.formatDate = function(concent) {
			var i = concent.indexOf(' ');
			return concent.substring(0, i);
		}
		$scope.flagCheckBox = function(id) {
				$("input[tag='" + id + "']").toggleClass("checked");
				if (!$("input[tag='" + id + "']").hasClass("checked")) {
					$('#btnSelectAll').removeClass('btn-selected');
				}
			}
			//跳转到详细信息
		$scope.gotoDetails = function(id) {

			window.location.href = "#/declarationsuccess?id=" + id;
		}
	});

	//显示知道了或者确认取消 showOk为true显示知道了按钮  false显示确认取消按钮
	function dialogButtonOp(showOk) {
		if (showOk) {
			$("#dialogCancel").show();
			$("#dialogConfirm").hide();
		} else {
			$("#dialogCancel").hide();
			$("#dialogConfirm").show();
		}
	}

	//获取消息列表 修改分页 所以注释无特效分页
	function getData($scope, selectcaseServices, pageIndex, pageSize) {
		$("#loadingToast").show();
		selectcaseServices.getAllMessage(keHuId, pageIndex, pageSize).success(function(result, statue) {
			$("#loadingToast").hide();
			if (result.code == 200) {
				$scope.items = result.data.message;
				if ($scope.items.length > 0) {
					for (var i = 0; i < $scope.items.length; i++) {
						if ($scope.items[i].xiaoXiZhuangTai == "0") {
							$scope.items[i].xiaoXiZhuangTai = "未读";
						} else {
							$scope.items[i].xiaoXiZhuangTai = "已读";
						}
					}
					$scope.norecord = false;
					if (result.data.pageCount % $scope.pageSize == 0) {
						$scope.pageTotal = parseInt(result.data.pageCount / $scope.pageSize);
					} else {
						$scope.pageTotal = parseInt(result.data.pageCount / $scope.pageSize) + 1;
					}
				} else {
					$scope.norecord = true;
				}
			}
		}).error(function(data, statue) {
			$("#loadingToast").hide();
		});
	}

});
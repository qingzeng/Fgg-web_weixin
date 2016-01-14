define(['jquery','_layer'], function($,$layer) {
     
    // 创建Open窗体
    function CreateMsgDialog() {
        var settings = { 
            // 标题
            title: "提示",
            // 内容
            content:"" ,
            // 按钮
            btn: null,
        };
        return settings;
    }

     
  return {
        closeAll:function(){
             $layer.closeAll();
        },
        loadding: function (isShow) { 
           if(isShow !=false)
           {
               isShow =true;
           }
           if(isShow==true)
           {  
               $layer.open({
                type: 2,
                content: '数据加载中'
              }); 
           }else{
               $layer.closeAll();
           } 
        },
        alter:function(options)
        {
            var $$Settings = CreateMsgDialog();
            if (options) {
                $.extend($$Settings, options); 
            }
            $layer.open({
                title: [  
                    $$Settings.title,
                    'background-color:#0099CC; color:#fff;' //标题样式
                ],
                content:$$Settings.content,
                btn:$$Settings.btn
            })
        },
        comfire:function(options)
        {
            var $$Settings = CreateMsgDialog();
            if (options) {
                $.extend($$Settings, options); 
            }
            $layer.open({
                title: [  
                    $$Settings.title,
                    'background-color:#0099CC; color:#fff;' //标题样式
                ],
                content:$$Settings.content,
                btn:$$Settings.btn,
                yes:function(){},
                no:function(){},
           
            })
        },
        html:function(html)
        {  
            
            $layer.open({
                  type: 1,
                  content: html,
                    style: 'width:50%; height:50%; background-color:#F2F2F2; border:none;'
            })
        }
    };
});
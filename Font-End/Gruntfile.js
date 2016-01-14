module.exports = function(grunt) {
    //var sassStyle = 'expanded';
    /*团队成员开发
     *安装好node(最新版本默认已装好npm)和grunt后，(可使用命令node -v，grunt -version来检查是否安装成功)
     *cmd进入项目文件夹下面（与该文件目录相同）输入命令 npm install，
     *NPM 会自动读取 package.json 文件，将 grunt 和有关插件给你下载下来，很方便的
     */
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'), //读取项目信息文件
        //要输出的sass文件
        /* sass: {
      output : {
        options: {
          style: sassStyle
        },
        files: {
          './style.css': './scss/style.scss'
        }
      }
    },*/
        //js文件合并
        //  concat: {
        //    dist: {
        //      src: ['./src/plugin.js', './src/plugin2.js'],
        //      dest: './global.js',
        //    }
        //  },
        //css文件压缩
        /*cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    './Font-End/content/css/examplemin.css': ['./Font-End/content/css/example.css']
                }
            }
        },*/
        //js文件压缩
        uglify: {
            compressjs: {
                files: {
                    './Font-End/content/main.min.js': ['./Font-End/content/main.js']
                }
            },
            //builda: {//任务一:压缩a.js,不混淆变量名,保留注释，添加banner和footer
            //   options: {
            //        mangle: false, //不混淆变量名
            //        preserveComments: 'all', //不删除注释,还可以为 false(删除全部注释),some(保留@preserve @license @cc_on等注释)
            //  banner:'/**\n* author:<%= pkg.author %>\n* version:<%= pkg.version %>\n*/\n',
            //        footer:'\n/*! <%= pkg.name %> 最后修改于： <%= grunt.template.today("yyyy-mm-dd") %> */'//添加footer
            //        },
            //        files: {
            //            './src/plugin.min.js': ['./src/plugin.js']
            //        }
            //    }
        },
        //js文件语法检测
        jshint: {
            all: ['./Font-End/content/main.js']
        },
        //实时监控被修改的文件
        watch: {
            //js: {
            //    files: ['./Font-End/controllers/**/*.js','./Font-End/content/plug-in/app.js'],
            //    options:{livereload:true}
            //},
            //html:{
            //    files: ['./Font-End/views/**/*.html','./Font-End/views/.html'],
            //    options:{livereload:true}
            //},
            //css:{
            //    files: ['./Font-End/content/css/*.css'],
            //    options:{livereload:true}
            //},
            /*sass: {
              files: ['./scss/style.scss'],
              tasks: ['sass']
            },*/
            //浏览器自动更新修改的文件
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files:[
                    './Font-End/controllers/**/*.js','./Font-End/content/lib/app.js','./Font-End/content/main.js',
                    './Font-End/views/**/*.html','./Font-End/views/.html','./Font-End/content/images/*.png',
                    './Font-End/content/css/*.css'
                ]
            }
        },
        //开启web服务
        connect: {
            options: {
                port: 9000,
                open: true,
                livereload: 35729,
                // Change this to '0.0.0.0' to access the server from outside
                hostname: '192.168.3.189'//192.168.3.189 localhost
            },
            server: {
                options: {
                    port: 9015,
                    base: './'
                }
            }
        }
    });
    //加载的模块
    grunt.loadNpmTasks('grunt-contrib-sass'); //sass文件转css文件模块
    grunt.loadNpmTasks('grunt-contrib-concat'); //js文件合并模块
    grunt.loadNpmTasks('grunt-contrib-jshint'); //js文件语法检测模块
    grunt.loadNpmTasks('grunt-contrib-uglify'); //js文件压缩模块
    grunt.loadNpmTasks('grunt-contrib-watch'); //实时监控被修改的文件模块
    grunt.loadNpmTasks('grunt-contrib-connect'); //开启web服务模块
    grunt.loadNpmTasks('grunt-contrib-cssmin'); //css文件压缩模块
    //任务命令配置
    //grunt.registerTask('outputcss',['sass']);
    //grunt.registerTask('minjs', ['uglify:builda']);
    //grunt.registerTask('concatjs',['concat']);
    //grunt.registerTask('mincss', ['cssmin']);
    grunt.registerTask('compressjs', ['jshint','uglify']);
    grunt.registerTask('watchit', ['jshint', 'connect', 'watch']);
    grunt.registerTask('default');
};

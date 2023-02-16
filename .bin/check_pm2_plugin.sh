#!/bin/bash
LIST=`npm run pm2 list | grep 'pm2-logrotate' | grep '2.6.0'`

if [ "$LIST" ]
then
    echo '已安装pm2-logrotate插件'
else
    echo '未安装pm2-logrotate插件'
    echo '正在安装'
    npm run pm2 install pm2-logrotate@2.6.0
    echo '安装完成'
    npm run pm2 set pm2-logrotate:max_size 200M
    npm run pm2 set pm2-logratate:retain 10
    npm run pm2 set pm2-logrotate:compress true
    npm run pm2 set pm2-logrotate:TZ Asia/Shanghai
fi
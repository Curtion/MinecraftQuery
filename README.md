# 说明
查询Minecraft服务器信息，无需登录

# API

GET /?host=`hostname`&port=`port`

`hostname`可以为域名或者ip,`port`为端口号

 - 如果`hostname`为ip则`port`不可为空
 - 如果`hostname`为域名:
   - 如果port存在则通过A记录差选
   - 如果port不存在则通过SRV记录查询

# Minecraft可用版本

未知

# 部署方式

 - `pnpm install`
 - `pnpm build`
 - `pnpm start`
# socket2ws
一个node写的协议中转器，将Socket连接转换为Websocket链接。 适用于MUD游戏类应用，可以直接转成h5可用的websocket，并在其上进行后续二次开发。 后续将增加ssl支持，便于微信小程序使用。

#安装

yarn build

#运行
node nodexy.js

#配置
直接在nodexy.js前面改：
const maxnum=200;   //最大连接数
const MUDconfig = {host:'127.0.0.1',port:3040}  //MUD的服务器地址【上行连接MUD服务器】
const WEBconfig = {host:'127.0.0.1',port:8080}  //H5网页端的访问地址【下行连接客户端、HTML5】

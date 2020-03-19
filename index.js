/*
index.js
MUD Socket 2 WebSocket proxy
*/

const net = require('net');
const WebSocket = require('ws');
var iconv = require('iconv-lite');
const maxnum=200;   //最大连接数
const MUDconfig = {host:'127.0.0.1',port:3040}  //MUD的服务器地址
const WEBconfig = {host:'127.0.0.1',port:8080}  //H5网页端的访问地址

function linkxy(upsoc,downws){
	var that=upsoc;
	upsoc.downws=downws
	upsoc.on('data', function(msg) {
		//console.log('that.downws.send:',msg)
		var s=iconv.decode(msg, 'GBK')
		//console.log(s)
		that.downws.send(s)
	});
	upsoc.on('close', function() {
		//console.log('that.isclose-close')
		that.isclose=true
	});
	upsoc.on( 'error', function ( error ) {
		//console.log('that.isclose-error')
		that.isclose=true
	});
}
var usernum=0;
const wss = new WebSocket.Server({ port: WEBconfig.port});
wss.on('connection', function connection(downws, req) {
	if(usernum>maxnum){
		downws.terminate();
		return;
	}
	var that=downws;
	downws.upsocket=new net.Socket();
	linkxy(downws.upsocket,downws);
	downws.upsocket.connect(MUDconfig.port,MUDconfig.host, function(){});
	usernum++;
	that.userip = req.connection.remoteAddress;
	downws.on('message', function (message) {
		//console.log('that.upsocket.write:',message)
		var s=iconv.encode(message+"\r\n", 'GBK')
		that.upsocket.write(s)
    });
    downws.on('error',function(err){
		console.error('通道错误',err);
		//console.log('that.upsocket.end-error:quit\n')
		that.upsocket.end('quit\n')
		that.upsocket={}
		usernum--;
	});
    downws.on('close', function () {
		//console.log('that.upsocket.end-close:quit\n')
		that.upsocket.end('quit\n');
		that.upsocket={}
		usernum--;
	});
});
var CleanTimer=setInterval(function(){
	wss.clients.forEach(function each(client) {
		if (client.upsocket.isclose==true) {
			console.log('client.terminate\n')
			client.terminate();
		}
    });
	console.log(usernum)
},5000)

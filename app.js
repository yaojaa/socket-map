
var express = require('express');
var app = express();
var http = require('http').Server(app);

var io = require('socket.io')(http);

// var path =require('path');

var fs =require('fs')

app.use(express.static('views'));

// app.set('views', path.join(__dirname, 'views'));// 指定视图所在的位置
// app.set('view engine', 'html');

app.get('/', function (req, res) {
  res.render('index',{a:'i am a'});
});

var cityData=[];


io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  //当监听到数据变化时
  socket.on('add', function (data) {
  	console.log('data coming',data)
  	saveData(data)
    socket.broadcast.emit('addACity', data);
  });

    socket.on('reduce', function (data) {
  	console.log('data reduce',data)
  	saveData(data)
    socket.broadcast.emit('reduceAcity', data);
  });

  //数据清理
  socket.on('clearData',function(){
  	var clearData =[];
  	if(cityData.length<=0){
  		return 
  	}
  	for (var i = cityData.length - 1; i >= 0; i--) {
  		cityData[i].value = 0;
  		clearData.push(cityData[i])
  	}
    writeFile(clearData)
    console.log('数据清除成功')

  })

});
fs.readFile('./views/city.json','utf-8',function(err,data){
	if(err){
		return console.log(err)
	}
	cityData = JSON.parse(data);
	console.log(cityData)


})


var server = http.listen(8080, function () {
	console.log(server.address())
  var host = server.address().ip;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});

/*****辅助函数********/

function saveData(o){

	for (var i = cityData.length - 1; i >= 0; i--) {
		if (cityData[i].name == o.name){
				cityData[i].value = o.value			
		}
	}
	writeFile(cityData)
}

function writeFile(cityData){
		//写入json文件
	fs.writeFile('./views/city.json',JSON.stringify(cityData),function(err){
		if(err){
			console.log(err)
		}else{
			console.log('writeFile success')
		}

	})
}
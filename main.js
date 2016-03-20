var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var serialPort = require('serialport');
require('date-utils');

var sphero = require("sphero");
//var orb = sphero('/dev/tty.Sphero-BPO-AMP-SPP');
//var orb = sphero('/dev/tty.Sphero-YRW-AMP-SPP');
var _ = require('lodash');
var startTime = null;
var sockets = [];

//include timestamp
function processData(type,data){
  data['__timestamp'] = Date.now() - startTime ;
  data['__type'] = type;
  var dataString= JSON.stringify(data)+",";
//  console.log(dataString);
      io.emit('dataSend',data);
}

function resetStartTime(){
  startTime = Date.now();
}

/*
orb.connect(function(){
  orb.color("green");
  orb.detectCollisions({sps:10});

  orb.configureCollisions({
    meth : 0x01,
    xt: 0x7A,
    xs: 0xFF,
    yt: 0x7A,
    ys: 0xFF,
    dead: 100 
  },function(){
    console.log("configured"); 
  });

  var forward_p = true;
  orb.streamMotorsBackEmf();
  orb.streamGyroscope();
  orb.streamAccelerometer();
  orb.streamImuAngles();
  orb.streamAccelOne();
  orb.streamVelocity();
  orb.streamOdometer();

  orb.on("collision", function(data){
    processData("collision",data);
    orb.color("red");
    console.log("Collision");
    forward_p = !forward_p;
  });
  orb.on("odometer", function(data){
    processData("odometer",data);
  });
  orb.on("velocity", function(data){
    processData("velocity",data);
  });
  orb.on("accelOne", function(data){
    processData("accellOne",data);
  });
  orb.on("imuAngles", function(data){
    processData("imuAngles",data);
  });
  orb.on("accelerometer", function(data){
    processData("accelerometer",data);
  });
  orb.on("gyroscope", function(data){
    processData("gyroscope",data);
  });
  orb.on("motorsBackEmf", function(data){
    processData("motorsBackEmf",data);
  });

  resetStartTime();

  setInterval(function(){
    //orb.roll(150,forward_p ? 0 : 180);
    orb.color("green");
    forward_p = !forward_p;
  },100);
});
*/

app.use(express.static('client'));
app.get('/logger', function(req, res){
    res.sendFile(__dirname + '/logger.html');
});

app.get('/', function(req, res){
    res.sendFile(__dirname + '/controller.html');
});

io.sockets.on('connection', function(socket){
  socket.emit('startConnection');
  var data = {};
  socket.emit('dataSend',data);
  socket.on("resetTimeCount",resetStartTime);
  socket.on("listSerialPorts",function(){
    serialPort.list(function(err,ports){
      socket.emit("listSerialPorts",err,ports);
    });  
  });

  socket.on('disconnection',function(){
    
  });
});

http.listen(3000, function () {
});


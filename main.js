var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
require('date-utils');

var sphero = require("sphero");
var orb = sphero('/dev/tty.Sphero-BPO-AMP-SPP');
var _ = require('lodash');
var startTime = null;

//include timestamp
function processData(type,data){
  data['__timestamp'] = Date.now() - startTime ;
  data['__type'] = type;
  console.log(JSON.stringify(data)+",");
}



orb.connect(function(){
  startTime = Date.now();
  orb.color("lightseagreen");
  orb.detectCollisions({sps:10});

  orb.configureCollisions({
    meth : 0x01,
    xt: 0x07,
    xs: 0x07,
    yt: 0x07,
    ys: 0x07,
    dead: 0x05
  },function(){
    console.log("configured"); 
  });
  orb.streamMotorsBackEmf();
  orb.streamGyroscope();
  orb.streamAccelerometer();
  orb.streamImuAngles();
  orb.streamAccelOne();
  orb.streamVelocity();
  orb.streamOdometer();

  orb.on("collision", function(data){
    processData("collision",data);
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
  orb.roll(255,0);
});
app.use(express.static('client'));
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
  socket.emit('startConnection');
  var data = {};
  socket.emit('dataSend',data);
});
http.listen(3000, function () {
});


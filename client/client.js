var log ,data, cvs, ctx, WIDTH = 500, HEIGHT = 1500;
window.onload = function(){
  console.log('hello world2');
  main();
}

function main(){
  cvs = document.querySelector('#graph');
  cvs.width = WIDTH;
  cvs.height = HEIGHT;
  ctx = cvs.getContext('2d');
  log = document.querySelector('#log');
  
  var socket = io.connect();
  socket.on('startConnection',function(){
    console.log("socket connected");
  });

  socket.on('dataSend',function(data){
    console.log(data);
  });
}

function loadLog(){
  logObject = JSON.parse("[" + log.value + "]")[0];
  data = {};
  data.accelerometer = _.filter(logObject, function(d){ return d.__type == "accelerometer"});
  data.odometer = _.filter(logObject, function(d){ return d.__type == "odometer"});
  data.velocity = _.filter(logObject, function(d){ return d.__type == "velocity"});
  data.imuAngles = _.filter(logObject, function(d){ return d.__type == "imuAngles"});
  data.gyroscope = _.filter(logObject, function(d){ return d.__type == "gyroscope"});
  data.motorsBackEmf = _.filter(logObject, function(d){ return d.__type == "motorsBackEmf"});
  data.collision = _.filter(logObject, function(d){ return d.__type == "collision"});

  var start, last;
  var target = "accelerometer";
  init("red",target,
      data[target][0]["__timestamp"]/10,
      data[target][0]["yAccel"]["value"][0]);
  _.map(data[target], function(d){
    next(d["__timestamp"]/10,
        d["yAccel"]["value"][0]/10 + 500);
  });
} 


function init(color, name, x,y){
  ctx.strokeStyle = color;
  ctx.moveTo(x,y);
}

function next(x,y){
  ctx.lineTo(x,y);
  console.log(x,y);
  ctx.stroke();
}



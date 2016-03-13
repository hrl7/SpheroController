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
//    console.log(data);
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
  data = new Log(data);

  drawGraph(data, "accelerometer",  "steelblue", "/yAccel/value/0/");
  drawGraph(data, "accelerometer",  "blue", "/xAccel/value/0/");
  drawGraph(data, "accelerometer",  "dodgerblue", "/zAccel/value/0/");
  drawGraph(data, "velocity",       "palegreen", "/xVelocity/value/0/");
  drawGraph(data, "velocity",       "limegreen", "/yVelocity/value/0/");
  var normalizeDist = function(n){return n / 2 + 500};
  drawGraph(data, "odometer",       "red", "/xOdometer/value/0/", normalizeDist);
  drawGraph(data, "odometer",       "orange", "/yOdometer/value/0/", normalizeDist);
  drawGraph(data, "imuAngles",       "aquamarine", "/pitchAngle/value/0/");
  drawGraph(data, "imuAngles",       "turqoise", "/yawAngle/value/0/");
  drawGraph(data, "imuAngles",       "aqua", "/pitchAngle/value/0/");

  function drawGraph(data, type, graphColor, path, normalizeFn, timeShiftFn){
    var shiftTime = timeShiftFn || function(n){ return n / 10} ;
    var normalizeValue = normalizeFn || function(n){ return n / 20 + 500};

    var currentTarget = data.select(type);
    currentTarget.reset();
    var target = currentTarget.first();

    init(graphColor,type,target.mine("/__timestamp/")/10,target.mine(path));
    while((target = currentTarget.next()) != null){
      next( target.mine("/__timestamp/").apply(shiftTime),
            target.mine(path).apply(normalizeValue));
    }
    finish();
  }
} 

function Log(obj){
  this.data = obj;
  this.index = Array.isArray(obj) ? 0 :  null;
}

Log.prototype.apply = function (fn){
  return fn(this.data);
}

Log.prototype.select = function(key){
  if(arguments.length > 1){
    return this.mineWithPathArray(arguments);
  } else {
    return this.mine("/" + key + "/");
  }
}

Log.prototype.next = function(){
  if( this.index !== null){
    if(this.index < this.data.length - 1){
      this.index++;
      return new Log(this.data[this.index]);
    } else {
      return null; 
    }
  } else {
    throw new Error("not iteratable");
  }
}

Log.prototype.first = function(){
  if( this.index !== null){
    return new Log(this.data[0]);
  } else {
    throw new Error("not iteratable");
  }
}

Log.prototype.reset = function(){
  if( this.index !== null){
    this.index = 0;
  } else {
    throw new Error("not iteratable");
  }
}

Log.prototype.mineWithPathArray = function(paths){
  var obj = this.data, path;
  for(var i in paths){
    path = paths[i];
    if(obj.hasOwnProperty(path)){
      obj = obj[path];
    } else {
      throw new Error("property " + path + "  not found. " + JSON.stringify(obj) );
    }
  }
  return new Log(obj);
}

Log.prototype.mine = function (queryPath){
  var paths = queryPath.split('/').filter(Boolean);
  return this.mineWithPathArray(paths);
}

function init(color, name, x,y){
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.moveTo(x,y);
}

function next(x,y){
  ctx.lineTo(x,y);
  ctx.stroke();
}

function finish(){
  ctx.stroke();
  ctx.closePath();
}

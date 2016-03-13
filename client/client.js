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

  data = new DataSet();
  data.registerFilter("accelerometer", "__type", "accelerometer");
  data.registerFilter("odometer", "__type", "odometer");
  data.registerFilter("velocity", "__type", "velocity");
  data.registerFilter("imuAngles", "__type", "imuAngles");
  data.registerFilter("gyroscope", "__type", "gyroscope");
  data.registerFilter("motorsBackEmf", "__type", "motorsBackEmf");
  data.registerFilter("motorsBackEmf", "__type", "morotsBackEmf");
  data.registerFilter("collision", "__type", "collision");
  data.registerFilter("accelOne", "__type", "accellOne");
  data.push(JSON.parse("[" + log.value + "]")[0]);

  var mainGraph = new Graph(cvs);
  mainGraph.draw(data, "accelerometer",  "steelblue", "/yAccel/value/0/");
  mainGraph.draw(data, "accelerometer",  "blue", "/xAccel/value/0/");
  mainGraph.draw(data, "accelerometer",  "dodgerblue", "/zAccel/value/0/");
  mainGraph.draw(data, "velocity",       "palegreen", "/xVelocity/value/0/");
  mainGraph.draw(data, "velocity",       "limegreen", "/yVelocity/value/0/");
  var normalizeDist = function(n){return n / 2 + 500};
  mainGraph.draw(data, "odometer",       "red", "/xOdometer/value/0/", normalizeDist);
  mainGraph.draw(data, "odometer",       "orange", "/yOdometer/value/0/", normalizeDist);
  mainGraph.draw(data, "imuAngles",       "aquamarine", "/pitchAngle/value/0/");
  mainGraph.draw(data, "imuAngles",       "turqoise", "/yawAngle/value/0/");
  mainGraph.draw(data, "imuAngles",       "aqua", "/pitchAngle/value/0/");

} 

var log ,data, cvs, ctx, WIDTH = 1200, HEIGHT = 1500, socket;

function initSocket(){
  var socket = io.connect();
  socket.emit("resetTimeCount");
  socket.on('startConnection',function(){
    console.log("socket connected");
  });
}

function initLogger(){

  initSocket();

  socket.on('dataSend',function(log){
    if(data && log.hasOwnProperty("__type")){
      data.push(log);
    }
  });

  cvs = document.querySelector('#graph');
  cvs.width = WIDTH;
  cvs.height = HEIGHT;
  ctx = cvs.getContext('2d');
  log = document.querySelector('#log');

  data = new DataSet();
  var mainGraph = new Graph(cvs,data);
  data.registerFilter("accelerometer", "__type", "accelerometer");
  data.registerFilter("odometer", "__type", "odometer");
  data.registerFilter("velocity", "__type", "velocity");
  data.registerFilter("imuAngles", "__type", "imuAngles");
  data.registerFilter("gyroscope", "__type", "gyroscope");
  data.registerFilter("motorsBackEmf", "__type", "motorsBackEmf");
  data.registerFilter("motorsBackEmf", "__type", "morotsBackEmf");
  data.registerFilter("collision", "__type", "collision");
  data.registerFilter("accelOne", "__type", "accellOne");

  mainGraph.registerData(data, "accelerometer",  "steelblue", "/yAccel/value/0/");
  mainGraph.registerData(data, "accelerometer",  "blue", "/xAccel/value/0/");
  mainGraph.registerData(data, "accelerometer",  "dodgerblue", "/zAccel/value/0/");
  mainGraph.registerData(data, "velocity",       "palegreen", "/xVelocity/value/0/");
  mainGraph.registerData(data, "velocity",       "limegreen", "/yVelocity/value/0/");

  var normalizeDist = function(n){return n / 2 + 500};
  mainGraph.registerData(data, "odometer",       "red", "/xOdometer/value/0/", normalizeDist);
  mainGraph.registerData(data, "odometer",       "orange", "/yOdometer/value/0/", normalizeDist);
  mainGraph.registerData(data, "imuAngles",       "aquamarine", "/pitchAngle/value/0/");
  mainGraph.registerData(data, "imuAngles",       "turqoise", "/yawAngle/value/0/");
  mainGraph.registerData(data, "imuAngles",       "aqua", "/pitchAngle/value/0/");

  data.registerAfterDataPushing(function(){
      
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
  });
}

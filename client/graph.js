var OFFSET_X = 0;
function Graph(cvs, dataSet){
  this.cvs = cvs;
  this.ctx = this.cvs.getContext('2d');
  this.dataSet = dataSet;
}

Graph.prototype.registerData = function (data, type, graphColor, path, normalizeFn, timeShiftFn){
}

Graph.prototype.draw = function (data, type, graphColor, path, normalizeFn, timeShiftFn){

  try{
    var currentTarget = data.log.select(type);
    var target = currentTarget.first(this.dataSet.drawReg[type].index);
  } catch (e){
    return;
  }

  console.log("Drawing");
  var shiftTime = timeShiftFn || function(n){ return n / 30} ;
  var  normalizeValue = normalizeFn || function(n){ return n / 20 + 500};

  this.init(graphColor,type,
      target.mine("/__timestamp/").apply(shiftTime),
      target.mine(path).apply(normalizeValue));
  while((target = currentTarget.next()) != null){
    this.next(
        target.mine("/__timestamp/").apply(shiftTime),
        target.mine(path).apply(normalizeValue));
  }
  this.finish();
}

Graph.prototype.init = function (color, name, x,y){
  this.ctx.beginPath();
  this.ctx.strokeStyle = color;
  this.ctx.lineWidth = 0.1;
  this.ctx.moveTo(x + OFFSET_X ,y);
}

Graph.prototype.next = function (x,y){
  if(x + OFFSET_X > WIDTH){
    OFFSET_X = - x;
    this.ctx.clearRect(0,0,WIDTH,HEIGHT);
  }
  this.ctx.lineTo(x + OFFSET_X,y);
  this.ctx.stroke();
}

Graph.prototype.finish = function (){
  ctx.stroke();
  ctx.closePath();
}

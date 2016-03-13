function Graph(cvs){
  this.cvs = cvs;
  this.ctx = this.cvs.getContext('2d');
}

Graph.prototype.draw = function (data, type, graphColor, path, normalizeFn, timeShiftFn){
  var shiftTime = timeShiftFn || function(n){ return n / 10} ;
  var normalizeValue = normalizeFn || function(n){ return n / 20 + 500};

  var currentTarget = data.log.select(type);
  currentTarget.reset();
  var target = currentTarget.first();

  this.init(graphColor,type,target.mine("/__timestamp/").apply(shiftTime),
      target.mine(path).apply(normalizeValue));
  while((target = currentTarget.next()) != null){
    this.next( target.mine("/__timestamp/").apply(shiftTime),
          target.mine(path).apply(normalizeValue));
  }
  this.finish();
}

Graph.prototype.init = function (color, name, x,y){
  this.ctx.beginPath();
  this.ctx.strokeStyle = color;
  this.ctx.lineWidth = 0.1;
  this.ctx.moveTo(x,y);
}

Graph.prototype.next = function (x,y){
  this.ctx.lineTo(x,y);
  this.ctx.stroke();
}

Graph.prototype.finish = function (){
  ctx.stroke();
  ctx.closePath();
}

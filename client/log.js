function Log(obj){
  this.data = obj;
  this.index = Array.isArray(obj) ? 0 :  null;
  this.lastX = 0;
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

Log.prototype.first = function(index){
  if( this.index !== null){
    return new Log(this.data[index ? index : 0]);
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


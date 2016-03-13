function DataSet(){
  this.log= new Log({});
  this.filterFunctions = [];
}

DataSet.prototype.push = function(data){
  if(_.isArray(data)){
    _.map(data,(d)=>{this.pushOne(d)})
  } else {
    this.pushOne(data);
  }
}

DataSet.prototype.pushOne = function(data){
  if(!_.map(this.filterFunctions, (fn)=>{return fn(data)}).reduce((a,b)=>{return a||b})){
    throw new TypeError("Cannot catch " + data.toSource()); 
  };
}

DataSet.prototype.registerFilter = function(name, key, match ){
  this.filterFunctions.push(function(data){
    if(data[key] == match) {
      if(this.log.data[name] == undefined){
        this.log.data[name] = [];   
      }
      this.log.data[name].push(data);
      return true;
    } else {
      return false;
    }
  }.bind(this));    
}


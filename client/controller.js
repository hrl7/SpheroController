var term = null;
var DEBUG_KEY  = false;
var SOCKET = null;
var commands = { 
  echo : function(term, args){
    term.write(args.slice(1));
  },

  connect : function(term, args){
    SOCKET = io.connect(); 
    SOCKET.on('startConnection',function(){
      term.write("socket connected");
      term.writePrompt();
    });
  },

  reload : function(term, args){
    term.write("Reload");
    window.location.reload();
  },

  list : function(term, args){
    SOCKET.emit("listSerialPorts");
    term.write("Waiting...");
    SOCKET.on("listSerialPorts",function(err,ports){
      term.write("\n");
      for(var i = 0;i<ports.length;i++){
        term.write(i + ":" + ports[i].comName + "\n");
      }
      term.writePrompt();
    }); 
  },

  forward : function(){

  },
  
  back : function(){

  },

  left : function(){

  },

  right : function(){

  },

  clear : function(term,args){
    term.clear();
  },
};

function initController(){
  term = new Terminal(document.querySelector("#terminal"));
}


function Terminal(elem){
  this.element = elem;
  this.buffer = [""];
  this.leftPrompt = "Sphero $ ";
  this.keyBind = {};

  this.element.onkeydown = this.onKeyDown.bind(this);
  this.element.onkeyup = this.onKeyUp.bind(this);
  this.initKeyBind();

  this.element.value = "";
  this.write(this.prompt());
}

Terminal.prototype.initKeyBind = function(){
  this.keyBind["ArrowUp"] = function(){return false;};
  this.keyBind["ArrowDown"] = function(){return false;};
  this.keyBind["Enter"] = function(){this.execute();return false;}.bind(this);
}

Terminal.prototype.execute = function(){
  var line = this.buffer[this.buffer.length-1];
  var cmd = line.split(" ")[0];
  this.write("\n");
  if(commands.hasOwnProperty(cmd)){
   commands[cmd](this,line.split(" "));
  } else {
    this.write(cmd + " not found.");
  }
  this.buffer.push("");
  this.writePrompt();
}

Terminal.prototype.onKeyUp = function(e){
  var buf = this.element.value.split("\n");
  buf = buf[buf.length-1];
  this.buffer[this.buffer.length-1] = buf.slice(this.prompt().length);
}
Terminal.prototype.onKeyDown = function(e){
  if(DEBUG_KEY)console.log(e);
  if(this.keyBind.hasOwnProperty(e.key)){
    return this.keyBind[e.key]();
  }
  if(e.altKey || e.ctrlKey || e.metaKey){
    return false;
  }
}

Terminal.prototype.clear = function(){
  this.element.value = "";
}

Terminal.prototype.writePrompt = function(){
  this.element.value += "\n";
  this.element.value += this.prompt();
}

Terminal.prototype.write = function(str){
  this.element.value+=str;
}

Terminal.prototype.prompt = function(){
  if(typeof this.leftPrompt == "function"){
    return this.leftPrompt();
  } else {
    return this.leftPrompt;
  }
}

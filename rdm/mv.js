export('runCommand','dbSetup','setup');

var sp = require("rdm/subprocess");

var command;
var setup = new Object();
setup.binary = ""; //set this to the path for the DB binary
setup.type = ""; //set this to QM, UV, D3
setup.workingDirectory = ""; //UV - set this to the UV account path
setup.dbvm = ""; //D3 set this to the VM name you want to use


String.prototype.trim = function(){
	return this.replace(/^\s+|\s+$/g,'');
}



function dbSetup(user, pass, prog, data)
{
  var  params = "";
  var itemCnt = 0;

  setup.user = user;
  setup.password = pass;
  setup.program = prog;
 
  for(var key in data)
  {
    if(itemCnt > 0)
    {
      params += "&"
    }
    params += key+"="+escape(data[key]);
    itemCnt++;
  }
  setup.data = params;
}


function doCommand()
{
  var response;
  if(typeof(setup.type) != "undefined") 
  {
     switch(setup.type)
     {
        case "QM":
	  response = sp.command(setup.binary,"-QUIET","-A"+setup.user,setup.program,setup.data);
          break;
        case "UV":
          sp.setWorkingPath(setup.workingDirectory);
          cmdData = setup.program+" "+setup.data;
          response = sp.command(setup.binary,cmdData);       
	  break;
       case "D3":
	  cmdData = "\\f"+setup.user+"\\r"+setup.password+"\\r"+setup.program+" "+setup.data+"\\rEXIT\\r";
          response = sp.command(setup.binary,"-n",setup.dbvm,"-d",cmdData,"-dcdon","-s");
          break;

       default:
          break;
     }

  }

  return response;

}

function runCommand(){
   var results = doCommand();
   return results.trim();
};

//Brandon Robinson
include('ringo/webapp/response');
export('index','mv');

function index(req) {
    return skinResponse('skins/index.html', {
        content: "It's working!"
    });
};
function mv(req,acct,prog,format)
{
   var db = require('rdm/mv');
   db.dbSetup(acct,"",prog,req.params);
   var resp = db.runCommand();
   var response = new Response(resp);
   if(format !== undefined)
   { 
        switch(format.toLowerCase())
   	{
           case "xml":
             //response.contentType = 'application/xml';
             response = new xmlResponse(resp);
             break;
     	   case "json":
             //response.contentType = 'application/json';
	     var obj = eval('('+ resp +')');
             response = new jsonResponse(obj);
             break;
  	 }
   }
   //print("dbObj.isError: "+db.dbObj.isError.toString()); 
   return response;


};

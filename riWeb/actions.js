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
   db.dbSetup(acct,"",prog,req.queryString);
   var resp = db.runCommand();
   var response = new Response(resp);
   response.debug(); 
   if(format !== undefined)
   { 
        switch(format.toLowerCase())
   	{
           case "xml":
             response.contentType = 'application/xml';
             break;
     	   case "json":
             response.contentType = 'application/json';
             break;
  	 }
   }
   
   return response;


};

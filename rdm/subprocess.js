/*
* This module is based on the standard subprocess.js module that comes with Ringo. 
* We needed to do some specialized things for the different MV databases. 
*
* Written By: Brandon Robinson 07/15/10 for RDM Infinity, LLC
*/


include('io');

var File = java.io.File;


String.prototype.trim = function(){
	return this.replace(/^\s+|\s+$/,'');
}

function createProcess(args) {
    var command = Array.map(args, String);
   
    if(FileSetup != "")
    {
	var path = new File(FileSetup);
        return java.lang.Runtime.getRuntime().exec(command,null,path);
    }
    else
    {
        return java.lang.Runtime.getRuntime().exec(command);
    }

}

function connect(process, output, errput) {
    spawn(function() {
     //  new TextStream(new Stream(process.inputStream)).copy(output);
      var ts = new TextStream(new Stream(process.inputStream));
      var doOutput = false;

      while(true)
      {
           var line = ts.readLine();
	    if(!line.length)
	         break;
          if(line.substring(0,7) == "~~END~~")
          {
              doOutput = false;
          } 
          if(doOutput)
          { 
           output.write(line).flush();
          }
          if(line.substring(0,9) == "~~START~~")
          {
             doOutput = true;
          }
      }
       

    }).get();
    spawn(function() {
        new TextStream(new Stream(process.errorStream)).copy(errput);
    }).get();
}

var FileSetup = "";

exports.setWorkingPath=function(){
   FileSetup = arguments[0];
};

/**
 * executes a given command and returns the
 * standard output.  If the exit status is non-zero,
 * throws an Error.
 * @param {String} command and optional arguments as individual strings
 * @returns String the standard output of the command
 */
exports.command = function() {
    var process = createProcess(arguments);
    var output = new TextStream(new MemoryStream());
    var error = new TextStream(new MemoryStream());
    connect(process, output, error);
    var status = process.waitFor();
    if (status != 11 && status != 0) {
        throw new Error("(" + status + ") " + error.content);
    }
    
    return output.content;
};

/**
 * executes a given command, attached to this process's
 * output and error streams, and returns the exit status.
 * @param {String} command and optional arguments as individual strings
 * @returns Number exit status
 */
exports.system = function() {
    var process = createProcess(arguments);
    connect(process, system.stdout, system.stderr);
    return process.waitFor();
};

/**
 * executes a given command quietly and returns
 * the exit status.
 * @param {String} command and optional arguments as individual strings
 * @returns Number exit status
 */
exports.status = function() {
    var process = createProcess(arguments);
    connect(process, dummyStream(), dummyStream());
    return process.waitFor();
};

function dummyStream() {
    return {
        writable: function() true,
        readable: function() false,
        seekable: function() false,
        write: function() this,
        flush: function() this,
        close: function() this        
    }
}



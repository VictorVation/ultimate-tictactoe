// Tyler Adams sunday, january 26th, 2014
// you "node serverside.js" this
// current problem(s): 
//    -too-much-sending/receiving causes a seemingly infinite loop
//    -currently set up to respond to 2 users, any new connections may be able to add to the current game instance
var express = require('express'); 
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server,{log:false});

  io.set('transports', [  // set transport method of socket
    'websocket'
  , 'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
  ]);

//configure ports and static directories
var port = (parseInt(process.env.PORT) || 5000);
server.listen(port);
app.configure(function() 
{
	app.use(express.static(__dirname + '/static')); //the world can view only what's inside the static directory
});

//var Moniker = require('moniker'); // if we want to add random names to the user(s)
var sockets = [];

io.sockets.on('connection', function (socket)  // socket.io functionality
{
	sockets.push(socket); // add current socket to an array of socket
  	socket.on("clicking", function(data) // current socket listens for index.html with data being passed to it
    {  
  		/* // attempt to fix the too-much-sending/receiving loop
      if(data.responded) {
  			return;
  		}
  		data.responded=true;
      */
  		console.log("click");// notify that the user has clicked
  		for (var i = 0; i < sockets.length; i++) { // loop through all sockets to
  			if (sockets[i] != socket) { // send the updated information to other client
  				sockets[i].emit("clicked", data);
  				console.log("sending to socket "+i);
          // may also be wise to setup a for loop for io.sockets.length to ensure we aren't making an infinite array of sockets
  			}	
  		}
  		//io.sockets.emit("clicked", data); // use all sockets to emit to index.html, this shouldn't cause an infinite loop inside serverside
		//socket.emit("clicked", data); // use current socket to emit to index.html, this shouldn't cause an infinite loop inside serverside
				});
});

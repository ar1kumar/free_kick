/*
Authors - Arun Kumaran, Samir Merchant
Github - @ar1kumar, @fangedparakeet
Cheers bros.
*/

// var express =require('express');
//   var express = require('express'),
//     app = express()
//   , http = require('http')
//   , server = http.createServer(app)
//   // EventEmitter = require('events')
//   , io = require('socket.io').listen(server);

  var express =require('express');
  var app = express();
    // , http = require('http')
    // , server = http.createServer(app)
    // , io = require('socket.io').listen(server);

  // listen for new web clients:
  // server.listen(5000);
  var io = require('socket.io').listen(app.listen(process.env.PORT || 5000));

 var shot, save;

// listen for new web clients:
//server.listen(5000);

     //------------------- Default Shit--------------------------------------//
app.configure(function(){
    app.use(express.methodOverride());
    //app.use(express.bodyParser());
    app.use(app.router);
	app.use(express.json());
    app.use(express.urlencoded());
});

app.configure('development', function(){
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  var oneYear = 31557600000;
  app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
  app.use(express.errorHandler());
});

//------------------- Default Shit ends--------------------------------------//


//Socket functions starts//
io.sockets.on('connection', function (socket) {
	console.log('yolo');


	socket.on('kick', function(data) {
		shot = data.dir;
		if(save != null){
			penalty(shot, save);
		}
		console.log(data);
	});

	socket.on('block', function(data) {
		console.log(data);
		save = data.block_dir;
		if(shot != null){
			penalty(shot, save);
		}
	});


});

function penalty(theshot, thesave){
	io.sockets.emit('kicked', {'shot': theshot, 'save': thesave});
	shot = null;
	save = null;
}

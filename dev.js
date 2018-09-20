const serialIOC = require("./serialIOC");
const web = require('request-promise');

var ioc = new serialIOC();


//set up a couple of async functions:
ioc.register("getUsers", function(){
	console.log("getting Users");
	return web("https://jsonplaceholder.typicode.com/users")
	.then(function(json){
		console.log("gotUsers!");
	});
});
ioc.register("getPosts", function(){
	console.log("getting posts");
	return web("https://jsonplaceholder.typicode.com/posts")
	.then(function(json){
		console.log("gotPosts!");
	});
});
//get a 14MB file from nasa, this will almost certainly take longer than the other HTTP requests:
ioc.register("getWorld", function(){
	console.log("getting world");
	return web("https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73751/world.topo.bathy.200407.3x5400x2700.png")
	.then(function(image){
		console.log("gotWorld!");
	});
});

//now we have the namespace of all the resolved functions:
var ui = ioc.resolve();


//this example shows the crux of the problem.

//getWorld is fetching a massive file from NASA's webservers.
//getUsers and getPOsts are fetching relativly small user-datas.  but we want to ensure that they run AFTER getworld has completed running.

ui.getWorld();
ui.getUsers();
ui.getPosts();

//running this yields:

/*
isaak@isaak-ubuntu:~/Documents/obverse/ioc$ node dev.js 
ioc instantiated
getting world
getting Users
getting posts
gotPosts!
gotUsers!
gotWorld!
isaak@isaak-ubuntu:~/Documents/obverse/ioc$ 
*/

//what we really want to have happen is for each part to kick off, and then resolve before the next part completes.
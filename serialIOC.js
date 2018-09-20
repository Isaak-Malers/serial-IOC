var serialIOC = function() {

	this._behaviour = {
		"dryRun": 0,
		"serial": 1,
		"async":2
	}

	console.log("ioc instantiated");

	this.behaviour = this._behaviour.serial;
	this.serialNameSpace = {};

	//start off with a promise that imediatly resolves true:
	this.pending = new Promise(function (resolve){
		resolve(true);
	});
}

//TODO: add a 2nd string here that will be the "logging message"
//example functionality:
//ioc.register(myFunction, "clicking")
serialIOC.prototype.register = function(signature, toRegister){
	//to start off with, handle the case where toRegister is a function.
	if(toRegister instanceof Function){
		this.serialNameSpace[signature] = toRegister;
	}
	else{
		//TODO: implement injection for objects.
		console.log("IOC for non functions hasn't been implemented yet dummy!");
	}
}

serialIOC.prototype.resolve = function(){
	return this.serialNameSpace;
}

module.exports = serialIOC;
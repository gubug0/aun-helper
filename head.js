window.alert = function alert(msg) { 
	console.log('hidden alert : ' + msg); 
};
window.confirm = function confirm(msg) { 
	console.log("hidden confirm : " + msg); 
	return true; 
};

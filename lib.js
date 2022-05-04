function getCurrentDateString() { 
	function pad(n) { return n<10 ? "0"+n : n } 
	const d=new Date() 
	return pad(d.getMonth()+1) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()) 
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function createWebWorker(workercode, action) {
	let code = workercode.toString();
	code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

	const blob = new Blob([code], { type: "application/javascript" });
	const worker_script = new Worker(URL.createObjectURL(blob));

	worker_script.onmessage = ({ data: { data } }) => {
		action();
	};
	
	return worker_script;
}

function create1000msTimeoutWorker(action) {
	const workercode = () => {
	  setTimeout(() => {
		self.postMessage({ done: "done" });
	  }, 1000);
	};
	return createWebWorker(workercode, action);
}

function create500msIntervalWorker(action) {
	const workercode = () => {
	  setInterval(() => {
		self.postMessage({ done: "done" });
	  }, 500);
	};
	
	return createWebWorker(workercode, action);
}

function create50msIntervalWorker(action) {
	const workercode = () => {
	  setInterval(() => {
		self.postMessage({ done: "done" });
	  }, 50);
	};
	
	return createWebWorker(workercode, action);
}

function create300msIntervalWorker(action) {
	const workercode = () => {
	  setInterval(() => {
		self.postMessage({ done: "done" });
	  }, 50);
	};
	
	return createWebWorker(workercode, action);
}




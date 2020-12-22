var log = function(argument) {
	if(process.env.REACT_APP_LOG === 1) {
		var pre = "Bullish log:";
		console.log(pre,argument);
	}
};

export default log;

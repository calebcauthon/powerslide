function Animator() {
	var queue = [];
	var timers = [];
	
	var getCurrentTime = function() {		
		var d = new Date();
		return d.getTime();
	};
	
	var lastDelay;
	var add = function(instructions) {		
		var dummyFn = function() {};		
		var animation = {};
		
		if(typeof(dummyFn) == typeof(instructions))
			animation.fn = instructions;
		else
			animation = instructions;
		
		if(typeof(dummyFn) != typeof(animation.onPause))
			animation.onPause = function() {};
		if(typeof(dummyFn) != typeof(animation.onResume))
			animation.onResume = function() {};
		if(typeof(dummyFn) != typeof(animation.onResumeExecute))
			animation.onResumeExecute = function() {};
		
		if(animation.wait)
			animation.delay = lastDelay + animation.wait;
		
		animation.isPaused = false;
		animation.hasCompleted = false;
		
		if(animation.delay)
			lastDelay = animation.delay;
		
		queue.push(animation);		
	};
	var play = function() {
		for(var i = 0; i < queue.length; i++)
		{
			var item = queue[i];
				
			if(!item.hasCompleted || item.persistent)
			{
				item.startingTime = getCurrentTime();
				var perforAnimationWithCallback = function(item, wasPaused) {	
					var env = { 
						callback: function() {
							item.hasCompleted = true;
						}
					};
					return function() {		
						if(wasPaused)
							item.onResumeExecute.call(env);
						
						item.fn.call(env);
					};
				}(item, item.isPaused);
								
				if(item.isPaused)
				{
					if(!item.persistent)
						item.isPaused = false;
						
					item.onResume();
				}
				
				if(item.delay) // check for a delay
				{
					var thisTimer = setTimeout(perforAnimationWithCallback, item.delay);
					timers.push(thisTimer);
				}
				else
				{													
					perforAnimationWithCallback();
				}
			}
		};
	};
	var pause = function() {
		for(var i = 0; i < timers.length; i++)
		{
			clearTimeout(timers[i]);
		}
		
		for(var i = 0; i < queue.length; i++)
		{						
			var item = queue[i];			
			var originalDelay = item.delay;
			var lostTime = getCurrentTime() - item.startingTime;
			var newDelay = originalDelay - lostTime;
			
			item.delay = newDelay;
			
			if(!item.hasCompleted || item.persistent)
			{
				item.onPause();
				item.isPaused = true;
			}			
			queue[i] = item;
		}		
	};
	var resume = function() {		
		play();
	};
	var clear = function() {
		pause();
		queue = [];
	};
	return {
		clear: clear,
		add: add,
		play: play,
		pause: pause,
		resume: resume
	};
};

function Animator() {
	var queue = [];
	var timers = [];
	
	
	var getCurrentTime = function() {		
		var d = new Date();
		return d.getTime();
	};
	var add = function(instructions) {		
		var dummyObj = function() {};
		
		var animation = {};
		
		if(typeof(dummyObj) == typeof(instructions))
		{
			animation.fn = instructions;
		}
		else
			animation = instructions;
		
		animation.hasCompleted = false;
		
		queue.push(animation);
	};
	var play = function() {
		for(var i = 0; i < queue.length; i++)
		{
			var item = queue[i];
				
			if(!item.hasCompleted) // only reschedule incomplete animations
			{
				item.startingTime = getCurrentTime();
				var perforAnimationWithCallback = function(item, fn) {	
					var env = { 
						callback: function() {
							item.hasCompleted = true;
						}
					};
					return function() {			
						item.fn.call(env);
					};
				}(item);
								
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
			
			queue[i] = item;
		}
	};
	var resume = function() {		
		play();
	};
	return {
		add: add,
		play: play,
		pause: pause,
		resume: resume
	};
};

function AudioControls() {
	
	var isFlash = false;
	var load = function(mp3_file) {				
		if(swfobject.getFlashPlayerVersion().major > 0)
		{
			isFlash = true;
			$f("player", "http://releases.flowplayer.org/swf/flowplayer-3.2.7.swf", {
				clip: {
					url: mp3_file,
				}
			});
		}
		else
		{
			$('#html5player')[0].setAttribute('src', mp3_file);
			$('#html5player')[0].play();						
		}
		
	};
	var play = function() {		
		if(isFlash)
			$f().play();
		else
			$('#html5player')[0].play();		
	};
	var pause = function() {
		if(isFlash)
			$f().pause();
		else
			$('#html5player')[0].pause();		
	};
	var seek = function(sec) {
		if(isFlash)
			$f().seek(sec);
		else
			$('#html5player')[0].currentTime = sec;		
	};
	
	return {
		load: load,
		play: play,
		pause: pause,
		seek: seek
	};
};

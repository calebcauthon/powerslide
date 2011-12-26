describe('AudioControls', function() {
	
	var adjustment;	
	var PLAYING = 3;
	var PAUSED = 4;
	var lastTime;
	var getState = function() {
		if(swfobject.getFlashPlayerVersion().major > 0)
			return $f().getState(); // flowplayer
		else
		{	
			var t = $('#html5player')[0].currentTime;
			
			if(t > 0 && t == lastTime)
				var r = PAUSED; // paused
			else if(t > 0 && t > lastTime && (t - lastTime) < .05)
			{
				var r = PLAYING; // playing
			}
				
			lastTime = t;
			
			return r;
			
			
		}
	};
	var getTime = function() {
		if(swfobject.getFlashPlayerVersion().major > 0)
			return $f().getTime(); // flowplayer
		else
			return $('#html5player')[0].currentTime;		
	};
	
	var audioControls;
	beforeEach(function() {
		audioControls = new AudioControls();
	});
	afterEach(function() {
		$('#player').html('');
		$('#audioWrapper').html('').html('<audio id="html5player" controls="controls">');
	});	
	it('should exist', function() {
		var audioControls = new AudioControls();
	});
	describe('load method', function() {
		it('should have a load method', function() {
			audioControls.load('http://releases.flowplayer.org/data/fake_empire.mp3');
			waitsFor(function() {			
				return (getState() == 3); // playing				
			}, "flowplayer failed to load", 5000);
		});		
	});
	describe('pause method', function() {
		it('should pause the track', function() {
			audioControls.load('http://releases.flowplayer.org/data/fake_empire.mp3');			
			waitsFor(function() {						
				return (getState() == 3); // playing				
			}, "flowplayer failed to load", 2000);
			
			runs(function() {							
				audioControls.pause();				
			});
			waitsFor(function() {
				return getState() == 4; // paused
			}, "", 5000);
		});
	});
	describe('play method', function() {
		it('calculate playtime adjustment', function() {
			audioControls.load('http://releases.flowplayer.org/data/fake_empire.mp3');			
			waitsFor(function() {						
				return (getState() == 3); // playing				
			}, "flowplayer failed to load", 2000);

			runs(function() {							
				audioControls.pause();												
				audioControls.seek(6);
				audioControls.play();				
				var d = new Date();
				t1 = d.getTime();
			});
			
			waitsFor(function() {				
				return getState() == 3; // playing							
			}, "", 5000);	

			runs(function() {
				var d = new Date();
				t2 = d.getTime();
				adjustment = t2 - t1;
			});			
		});
		it('should play the track', function() {
			audioControls.load('http://releases.flowplayer.org/data/fake_empire.mp3');			
			waitsFor(function() {						
				return (getState() == 3); // playing				
			}, "flowplayer failed to load", 2000);
			
			runs(function() {							
				audioControls.pause();				
				audioControls.play();
			});
			waitsFor(function() {
				return getState() == 3; // paused
			}, "", 5000);
		});
		it('should play the track immediately', function() {
			audioControls.load('http://releases.flowplayer.org/data/fake_empire.mp3');			
			waitsFor(function() {						
				return (getState() == 3); // playing				
			}, "flowplayer failed to load", 2000);
			
			runs(function() {							
				audioControls.pause();												
				audioControls.seek(6);
				audioControls.play();				
				expect(getTime()).toBeGreaterThan(5.9);				
			});
			
			waits(adjustment);
			waits(1200);		
			
			runs(function() {						
				expect(getTime()).toBeGreaterThan(7.2);				
			});
		});
	});
	describe('seek method', function() {
		it('should seek to the current spot while playing', function() {
			audioControls.load('http://releases.flowplayer.org/data/fake_empire.mp3');
			waitsFor(function() {			
				return (getState() == 3); // playing				
			}, "flowplayer failed to load", 2000);
			runs(function() {
				audioControls.play();
				audioControls.seek(10);
				audioControls.pause();
				expect(getTime()).toBeGreaterThan(9.9);
				expect(getTime()).toBeLessThan(10.1);
			});
		});		
	});	
});
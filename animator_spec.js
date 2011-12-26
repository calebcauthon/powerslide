describe('animator', function() {
	var animator;
	beforeEach(function() {
		animator = new Animator();
	});
	it('should have a push method', function() {
		var someArray = [];
		someArray.push(1);
		expect(someArray.length).toBe(1);
	});
	it('should exist', function() {
		var animator = new Animator();
	});
	it('should have an add() method', function() {
		animator.add({});
	});
	it('should have a play() method', function() {
		animator.play();
	});
	describe('play', function() {
		it('should execute 1 method which were added using add()', function() {
			var a = 1;
			var fn = function() {
				a = 2;
			};
			
			expect(a).toEqual(1);
			animator.add(fn);
			animator.play();
			expect(a).toBe(2);
		});
		it('should execute 2 methods which were added using add()', function() {
			var a = 1;
			var b = 0;
			var fn1 = function() {
				a = 'first';
				b++;
			};
			var fn2 = function() {
				a = 'second';
				b++;
			};
			
			expect(a).toEqual(1);
			expect(b).toEqual(0);	
			
			animator.add(fn1);
			animator.add(fn2);
			animator.play();
			
			expect(a).toBe('second');			
			expect(b).toBe(2);
		});
		it('should accept .fn parameter', function() {
			var a = 1;
			var fn = function() {
				a = 2;
			};
			
			expect(a).toEqual(1);
			animator.add({
				fn: fn
			});
			animator.play();
			expect(a).toBe(2);
		});
		it('should accept a .delay parameter (milliseconds)', function() {
			var old_value = 1;
			var new_value = 2;
			
			var a = old_value;
			var fn = function() {
				a = new_value;
			};
			
			expect(a).toEqual(old_value);
			animator.add({
				fn: fn,
				delay: 300
			});
			animator.play();
			expect(a).toBe(old_value);
			
			waits(400);
			
			runs(function() {
				expect(a).toBe(new_value);
			});
			
			
		});
	});
	it('should have a pause() method', function() {
		animator.pause();
	});
	describe('pause', function() {
		it('should halt all future executions', function() {
			var old_value = 1;
			var new_value = 2;
			
			var a = old_value;
			var fn = function() {
				a = 2;
			};
			
			expect(a).toEqual(old_value);
			animator.add({
				fn: fn,
				delay: 25
			});
			animator.play();			
			expect(a).toBe(old_value);
			
			animator.pause();
			
			waits(50);
			
			runs(function() {
				expect(a).toBe(old_value);
			});
		});		
	});	
	it('should have a resume() method', function() {
		animator.resume();
	});
	describe('resume', function() {
		it('should re-execute all un-executed methods', function() {
			var old_value = 1;
			var new_value = 2;
			
			var a = old_value;
			var fn = function() {
				a = 2;
			};
			
			expect(a).toEqual(old_value);
			animator.add({
				fn: fn,
				delay: 25
			});
			animator.play();			
			expect(a).toBe(old_value);
			
			animator.pause();
			waits(50);			
			runs(function() {
				expect(a).toBe(old_value);				
				animator.resume();
			});			
			waits(25);
			runs(function() {
				expect(a).toBe(new_value);
			});			
		});
		it('should consider how much time has passed when resuming', function() {
			var balloon = 'red';
			var fn = function() {
				balloon = 'blue';
			}
			
			expect(balloon).toBe('red');
			animator.add({
				delay: 30,
				fn: fn
			});
			
			animator.play();
			waits(20);
			runs(function() {
				animator.pause();
				expect(balloon).toBe('red');
				animator.resume();
			});
			
			waits(20);			
			
			runs(function() {
				expect(balloon).toBe('blue')
			});			
		});
		it('should execute all methods which have not completed', function() {
			var age = 10;
			
			var age10years = function() {				
				var callback = this.callback;
				setTimeout(function() {					
					age = age + 10;
					callback();
				}, 100);
			};
			
			var fn1 = {
				fn: age10years,
				delay: 100
			};
				
			
			animator.add(fn1);
			animator.play();
			waits(150);			
			runs(function() {
				animator.pause();
				expect(age).toBe(10);
			});
				
			waits(100);
			runs(function() {				
				expect(age).toBe(20);
				animator.resume();								
			});
			waits(250);
			runs(function() {
				expect(age).toBe(20);
			});
			
			
			
			
		});
	});
});
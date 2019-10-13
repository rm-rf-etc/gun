// import Gun from '../dist/gun';
// import fs from 'fs';
// import fsrm from '../lib/fsrm';
// import serve from '../lib/serve';
// import initStore from '../lib/store';

describe('Gun', function() {
	var root;
	(function(){
		var env;
		if(typeof global !== 'undefined'){ env = global }
		if(typeof window !== 'undefined'){ env = window }
		root = env.window? env.window : global;
		try{ env.window && root.localStorage && root.localStorage.clear() }catch(e){}
		try{ localStorage.clear() }catch(e){}
		try{ indexedDB.deleteDatabase('radatatest') }catch(e){}
		try{ require('fs').unlinkSync('data.json') }catch(e){}
		try{ require('../lib/fsrm')('radatatest') }catch(e){}
		//root.Gun = root.Gun || require('../gun');
		if(root.Gun){
			root.Gun = root.Gun;
			root.Gun.TESTING = true;
		} else {
			root.Gun = require('../dist/gun').default;
			root.Gun.TESTING = true;
			Gun.serve = require('../lib/serve');
			//require('../lib/file');
			require('../lib/store');
			require('../lib/rfs');
			require('./rad/rad.js');
			require('./sea/sea.js');
		}
	}());
	//Gun.log.squelch = true;
	var gleak = {globals: {}, check: function(){ // via tobyho
	  var leaked = []
	  for (var key in gleak.globe){ if (!(key in gleak.globals)){ leaked.push(key)} }
	  if (leaked.length > 0){ console.log("GLOBAL LEAK!", leaked); return leaked }
	}};
	(function(env){
		for (var key in (gleak.globe = env)){ gleak.globals[key] = true }
	}(this));

	var t = {};
	// try{ root.localStorage && root.localStorage.clear() }catch(e){}
	// try{ localStorage.clear() }catch(e){}
	// try{ indexedDB.deleteDatabase('radatatest') }catch(e){}
	// try{ fs.unlinkSync('data.json') }catch(e){}
  	// try{ fsrm('radatatest') }catch(e){}
	// if(root.Gun){
	// 	root.Gun.TESTING = true;
	// } else {
	// 	root.Gun = Gun;
	// 	root.Gun.TESTING = true;
	// 	Gun.serve = serve;
	// 	initStore(Gun);
	// 	// require('../lib/rfs'); // doesn't appear to do anything
	// }

	describe('Utility', function() {
		var u;
		/* // causes logger to no longer log.
		it('verbose console.log debugging', function(done) {

			var gun = Gun();
			var log = root.console.log, counter = 1;
			root.console.log = function(a,b,c){
				--counter;
				//log(a,b,c);
			}
			Gun.log.verbose = true;
			gun.put('bar', function(err, yay){ // intentionally trigger an error that will get logged.
				expect(counter).to.be(0);

				Gun.log.verbose = false;
				gun.put('bar', function(err, yay){ // intentionally trigger an error that will get logged.
					expect(counter).to.be(0);

					root.console.log = log;
					done();
				});
			});
		} );
		*/

		describe('Type Check', function() {
			it('binary', function() {
				expect(Gun.bi.is(false)).to.be(true);
				expect(Gun.bi.is(true)).to.be(true);
				expect(Gun.bi.is(u)).to.be(false);
				expect(Gun.bi.is(null)).to.be(false);
				expect(Gun.bi.is('')).to.be(false);
				expect(Gun.bi.is('a')).to.be(false);
				expect(Gun.bi.is(0)).to.be(false);
				expect(Gun.bi.is(1)).to.be(false);
				expect(Gun.bi.is([])).to.be(false);
				expect(Gun.bi.is([1])).to.be(false);
				expect(Gun.bi.is({})).to.be(false);
				expect(Gun.bi.is({a:1})).to.be(false);
				expect(Gun.bi.is(function() {})).to.be(false);
			});
			it('number', function() {
				expect(Gun.num.is(0)).to.be(true);
				expect(Gun.num.is(1)).to.be(true);
				expect(Gun.num.is(Infinity)).to.be(true);
				expect(Gun.num.is(u)).to.be(false);
				expect(Gun.num.is(null)).to.be(false);
				expect(Gun.num.is(NaN)).to.be(false);
				expect(Gun.num.is('')).to.be(false);
				expect(Gun.num.is('a')).to.be(false);
				expect(Gun.num.is([])).to.be(false);
				expect(Gun.num.is([1])).to.be(false);
				expect(Gun.num.is({})).to.be(false);
				expect(Gun.num.is({a:1})).to.be(false);
				expect(Gun.num.is(false)).to.be(false);
				expect(Gun.num.is(true)).to.be(false);
				expect(Gun.num.is(function() {})).to.be(false);
			});
			it('text', function() {
				expect(Gun.text.is('')).to.be(true);
				expect(Gun.text.is('a')).to.be(true);
				expect(Gun.text.is(u)).to.be(false);
				expect(Gun.text.is(null)).to.be(false);
				expect(Gun.text.is(false)).to.be(false);
				expect(Gun.text.is(true)).to.be(false);
				expect(Gun.text.is(0)).to.be(false);
				expect(Gun.text.is(1)).to.be(false);
				expect(Gun.text.is([])).to.be(false);
				expect(Gun.text.is([1])).to.be(false);
				expect(Gun.text.is({})).to.be(false);
				expect(Gun.text.is({a:1})).to.be(false);
				expect(Gun.text.is(function() {})).to.be(false);
			});
			it('list', function() {
				expect(Gun.list.is([])).to.be(true);
				expect(Gun.list.is([1])).to.be(true);
				expect(Gun.list.is(u)).to.be(false);
				expect(Gun.list.is(null)).to.be(false);
				expect(Gun.list.is(0)).to.be(false);
				expect(Gun.list.is(1)).to.be(false);
				expect(Gun.list.is('')).to.be(false);
				expect(Gun.list.is('a')).to.be(false);
				expect(Gun.list.is({})).to.be(false);
				expect(Gun.list.is({a:1})).to.be(false);
				expect(Gun.list.is(false)).to.be(false);
				expect(Gun.list.is(true)).to.be(false);
				expect(Gun.list.is(function() {})).to.be(false);
			});
			it('obj', function() {
				expect(Gun.obj.is({})).to.be(true);
				expect(Gun.obj.is({a:1})).to.be(true);
				expect(Gun.obj.is(u)).to.be(false);
				expect(Gun.obj.is()).to.be(false);
				expect(Gun.obj.is(undefined)).to.be(false);
				expect(Gun.obj.is(null)).to.be(false);
				expect(Gun.obj.is(NaN)).to.be(false);
				expect(Gun.obj.is(0)).to.be(false);
				expect(Gun.obj.is(1)).to.be(false);
				expect(Gun.obj.is('')).to.be(false);
				expect(Gun.obj.is('a')).to.be(false);
				expect(Gun.obj.is([])).to.be(false);
				expect(Gun.obj.is([1])).to.be(false);
				expect(Gun.obj.is(false)).to.be(false);
				expect(Gun.obj.is(true)).to.be(false);
				expect(Gun.obj.is(function() {})).to.be(false);
				expect(Gun.obj.is(new Date())).to.be(false);
				expect(Gun.obj.is(/regex/)).to.be(false);
				this.document && expect(Gun.obj.is(document.createElement('div'))).to.be(false);
				expect(Gun.obj.is(new (function Class(){ this.x = 1; this.y = 2 })())).to.be(true);
			});
			it('fn', function() {
				expect(Gun.fn.is(function() {})).to.be(true);
				expect(Gun.fn.is(u)).to.be(false);
				expect(Gun.fn.is(null)).to.be(false);
				expect(Gun.fn.is('')).to.be(false);
				expect(Gun.fn.is('a')).to.be(false);
				expect(Gun.fn.is(0)).to.be(false);
				expect(Gun.fn.is(1)).to.be(false);
				expect(Gun.fn.is([])).to.be(false);
				expect(Gun.fn.is([1])).to.be(false);
				expect(Gun.fn.is({})).to.be(false);
				expect(Gun.fn.is({a:1})).to.be(false);
				expect(Gun.fn.is(false)).to.be(false);
				expect(Gun.fn.is(true)).to.be(false);
			});
			it('time', function() {
				t.ts = Gun.time.is();
				expect(13 <= t.ts.toString().length).to.be.ok();
				expect(Gun.num.is(t.ts)).to.be.ok();
				expect(Gun.time.is(new Date())).to.be.ok();
			});
		});
		describe('Text', function() {
			it('ify', function() {
				expect(Gun.text.ify(0)).to.be('0');
				expect(Gun.text.ify(22)).to.be('22');
				expect(Gun.text.ify([true,33,'yay'])).to.be('[true,33,"yay"]');
				expect(Gun.text.ify({a:0,b:'1',c:[0,'1'],d:{e:'f'}})).to.be('{"a":0,"b":"1","c":[0,"1"],"d":{"e":"f"}}');
				expect(Gun.text.ify(false)).to.be('false');
				expect(Gun.text.ify(true)).to.be('true');
			});
			it('random', function() {
				expect(Gun.text.random().length).to.be(24);
				expect(Gun.text.random(11).length).to.be(11);
				expect(Gun.text.random(4).length).to.be(4);
				t.tr = Gun.text.random(2,'as'); expect((t.tr=='as'||t.tr=='aa'||t.tr=='sa'||t.tr=='ss')).to.be.ok();
			});
			it('match', function() {
				expect(Gun.text.match("user/mark", 'user/mark')).to.be.ok();
				expect(Gun.text.match("user/mark/nadal", {'=': 'user/mark'})).to.not.be.ok();
				expect(Gun.text.match("user/mark/nadal", {'*': 'user/'})).to.be.ok();
				expect(Gun.text.match("email/mark@gunDB.io", {'*': 'user/'})).to.not.be.ok();
				expect(Gun.text.match("user/mark/nadal", {'>': 'user/j', '<': 'user/o'})).to.be.ok();
				expect(Gun.text.match("user/amber/nadal", {'>': 'user/j', '<': 'user/o'})).to.not.be.ok();
				expect(Gun.text.match("user/amber/nadal", {'>': 'user/a', '<': 'user/c'})).to.be.ok();
				expect(Gun.text.match("user/mark/nadal", {'>': 'user/a', '<': 'user/c'})).to.not.be.ok();
			});
			it.skip('old match tests', function() {
				// below is OLD bloat, still available in lib/match.js
				expect(Gun.text.match("user/mark/nadal", {'*': 'user/', '>': 'j', '<': 'o', '?': 'm/n'})).to.be.ok();
				expect(Gun.text.match("user/amber/cazzell", {'*': 'user/', '?': 'm/n'})).to.not.be.ok();
				expect(Gun.text.match("user/mark/nadal", {'*': 'user/', '-': 'mad'})).to.be.ok();
				expect(Gun.text.match("user/mad/person", {'*': 'user/', '-': 'mad'})).to.not.be.ok();
				expect(Gun.text.match("user/mark/timothy/nadal", {'*': 'user/', '-': ['mark', 'nadal']})).to.not.be.ok();
				expect(Gun.text.match("user/amber/rachel/cazzell", {'*': 'user/', '-': ['mark', 'nadal']})).to.be.ok();
				expect(Gun.text.match("user/mark/nadal", {'*': 'user/', '+': 'ark'})).to.be.ok();
				expect(Gun.text.match("user/mad/person", {'*': 'user/', '+': 'ark'})).to.not.be.ok();
				expect(Gun.text.match("user/mark/timothy/nadal", {'*': 'user/', '+': ['mark', 'nadal']})).to.be.ok();
				expect(Gun.text.match("user/mark/timothy/nadal", {'*': 'user/', '+': ['nadal', 'mark']})).to.be.ok();
				expect(Gun.text.match("user/mark/timothy/nadal", {'*': 'user/', '+': ['mark', 'amber']})).to.not.be.ok();
				expect(Gun.text.match("user/mark/rachel/nadal/cazzell", {'*': 'user/', '+': ['mark', 'cazzell'], '-': ['amber', 'timothy']})).to.be.ok();
				expect(Gun.text.match("user/mark/rachel/timothy/cazzell", {'*': 'user/', '+': ['mark', 'cazzell'], '-': ['amber', 'timothy']})).to.not.be.ok();
				expect(Gun.text.match("photo/kitten.jpg", {'*': 'photo/', '!': '.jpg'})).to.be.ok();
				expect(Gun.text.match("photo/kittens.gif", {'*': 'photo/', '!': '.jpg'})).to.not.be.ok();
				expect(Gun.text.match("user/mark", {'~': 'user/Mark'})).to.be.ok();
			});
		});
		describe('List', function() {
			it('slit', function() {
				expect(Gun.list.slit.call([1, 2, 3, 'a', 'b', 'c'], 0)).to.eql([1, 2, 3, 'a', 'b', 'c']);
			});
			it('sort', function() {
				expect([{i:9},{i:4},{i:1},{i:-3},{i:0}].sort(Gun.list.sort('i'))).to.eql([{i:-3},{i:0},{i:1},{i:4},{i:9}]);
			});
			it('map', function() {
				expect(Gun.list.map([1,2,3,4,5],function(v,i,t){ t(v+=this.d); this.d=v; },{d:0})).to.eql([1,3,6,10,15]);
				expect(Gun.list.map([2,3,0,4],function(v,i,t){ if(!v){ return } t(v*=this.d); this.d=v; },{d:1})).to.eql([2,6,24]);
				expect(Gun.list.map([true,false,NaN,Infinity,'',9],function(v,i,t){ if(i===3){ return 0 }})).to.be(0);
			});
		});
		describe('Object', function() {
			it('del', function() {
				var obj = {a:1,b:2};
				Gun.obj.del(obj,'a');
				expect(obj).to.eql({b:2});
			});
			it('has', function() {
				var obj = {a:1,b:2};
				expect(Gun.obj.has(obj,'a')).to.be.ok();
			});
			it('empty', function() {
				expect(Gun.obj.empty()).to.be(true);
				expect(Gun.obj.empty({a:false})).to.be(false);
				expect(Gun.obj.empty({a:false},'a')).to.be(true);
				expect(Gun.obj.empty({a:false},{a:1})).to.be(true);
				expect(Gun.obj.empty({a:false,b:1},'a')).to.be(false);
				expect(Gun.obj.empty({a:false,b:1},{a:1})).to.be(false);
				expect(Gun.obj.empty({a:false,b:1},{a:1,b:1})).to.be(true);
				expect(Gun.obj.empty({a:false,b:1,c:3},{a:1,b:1})).to.be(false);
				expect(Gun.obj.empty({1:1},'danger')).to.be(false);
			});
			it('copy', function() {
				var obj = {"a":false,"b":1,"c":"d","e":[0,1],"f":{"g":"h"}};
				var copy = Gun.obj.copy(obj);
				expect(copy).to.eql(obj);
				expect(copy).to.not.be(obj);
			});
			it('ify', function() {
				expect(Gun.obj.ify('[0,1]')).to.eql([0,1]);
				expect(Gun.obj.ify('{"a":false,"b":1,"c":"d","e":[0,1],"f":{"g":"h"}}')).to.eql({"a":false,"b":1,"c":"d","e":[0,1],"f":{"g":"h"}});
			});
			it('map', function() {
				expect(Gun.obj.map({a:'z',b:'y',c:'x'},function(v,i,t){ t(v,i) })).to.eql({x:'c',y:'b',z:'a'});
				expect(Gun.obj.map({a:'z',b:false,c:'x'},function(v,i,t){ if(!v){ return } t(i,v) })).to.eql({a:'z',c:'x'});
				expect(Gun.obj.map({a:'z',b:3,c:'x'},function(v,i,t){ if(v===3){ return 0 }})).to.be(0);
			});
		});
		// deprecate?
		describe.skip('Functions', function() {
			it.skip('sum',function(done){
				var obj = {a:2, b:2, c:3, d: 9};
				Gun.obj.map(obj, function(num, key){
					setTimeout(this.add(function() {
						this.done(null, num * num);
					}, key), parseInt((""+Math.random()).substring(2,5)));
				}, Gun.fn.sum(function(err, val){
					expect(val.a).to.eql(4);
					expect(val.b).to.eql(4);
					expect(val.c).to.eql(9);
					expect(val.d).to.eql(81);
					done();
				}));
			});
		});
		describe('On', function() {
			it('subscribe', function(done){
				var e = {on: Gun.on};
				e.on('foo', function(a){
					done.first = true;
					expect(a).to.be(1);
					this.to.next(a);
				});
				e.on('foo', function(a){
					expect(a).to.be(1);
					expect(done.first).to.be.ok();
					done();
				});
				e.on('foo', 1);
			});
			it('unsubscribe', function(done){
				var e = {on: Gun.on};
				e.on('foo', function(a){
					this.off();
					done.first = a;
					expect(a).to.be(1);
					this.to.next(a);
				});
				e.on('foo', function(a){
					var to = this;
					expect(a).to.be(done.second? 2 : 1);
					expect(done.first).to.be(1);
					done.second = true;
					if(a === 2){
						setTimeout(function() {
							expect(e.tag.foo.to === to).to.be.ok();
							done();
						}, 10);
					}
				});
				e.on('foo', 1);
				e.on('foo', 2);
			});
			it('stun', function(done){
				var e = {on: Gun.on};
				e.on('foo', function(a, ev){
					if(2 === a){
						done.first2 = true;
						this.to.next(a);
						return;
					}
					setTimeout(function() {
						expect(done.second).to.not.be.ok();
						expect(done.second2).to.be.ok();
						expect(done.first2).to.be.ok();
						done();
					},10);
				});
				e.on('foo', function(a, ev){
					if(2 === a){
						done.second2 = true;
					} else {
						done.second = true;
					}
				});
				e.on('foo', 1);
				e.on('foo', 2);
			});
			it('resume', function(done){
				var e = {on: Gun.on};
				e.on('foo', function(a, ev){
					var to = this.to;
					setTimeout(function() {
						expect(done.second).to.not.be.ok();
						to.next(a);
					},10);
				});
				e.on('foo', function(a){
					done.second = true;
					expect(a).to.be(1);
					done();
				});
				e.on('foo', 1);
			});
			it('double resume', function(done){
				var e = {on: Gun.on};
				e.on('foo', function(a, ev){
					var to = this.to;
					setTimeout(function() {
						if(1 === a){
							done.first1 = true;
							expect(done.second).to.not.be.ok();
						}
						if(2 === a){
							done.first2 = true;
						}
						to.next(a);
					},10);
				});
				e.on('foo', function(a, ev){
					done.second = true;
					if(1 === a){
						expect(done.first2).to.not.be.ok();
						done.second1 = true;
					}
					if(2 === a){
						expect(done.first2).to.be.ok();
						if(done.second1){
							done();
						}
					}
				});
				e.on('foo', 1);
				e.on('foo', 2);
			});
			it('double resume different event', function(done){
				var e = {on: Gun.on};
				e.on('foo', function(a, ev){
					var to = this.to;
					setTimeout(function() {
						done.first1 = true;
						to.next(a);
					},10);
				});
				e.on('foo', function(a){
					if(1 === a){
						expect(done.first1).to.be.ok();
						done();
					}
				});
				e.on('foo', 1);
				e.on('bar', 2);
			});
			it('resume params', function(done){
				var e = {on: Gun.on};
				e.on('foo', function(a, ev){
					var to = this.to;
					setTimeout(function() {
						expect(done.second).to.not.be.ok();
						to.next(0);
					},10);
				});
				e.on('foo', function(a){
					done.second = true;
					expect(a).to.be(0);
					done();
				});
				e.on('foo', 1);
			});
			it('map', function(done){
				var e = {on: Gun.on};
				e.on('foo', function(a, ev){
					var to = this.to;
					Gun.obj.map(a.it, function(v,f){
						setTimeout(function() {
							var emit = {field: 'where', soul: f};
							to.next(emit);
						},10);
					})
				});
				e.on('foo', function(a, ev){
					var to = this.to;
					setTimeout(function() {
						to.next({node: a.soul});
					},100);
				});
				e.on('foo', function(a){
					if('a' == a.node){
						done.a = true;
					} else {
						expect(done.a).to.be.ok();
						done();
					}
				});
				e.on('foo', {field: 'where', it: {a: 1, b: 2}});
			});
			it('map synchronous', function(done){
				var e = {on: Gun.on};
				e.on('foo', function(a, ev){
					var to = this.to;
					Gun.obj.map(a.node, function(v,f){
						//setTimeout(function() {
							var emit = {field: 'where', soul: f};
							to.next(emit);
						//},10);
					})
				});
				e.on('foo', function(a, ev){
					var to = this.to;
					setTimeout(function() {
						to.next({node: a.soul});
					},100);
				});
				e.on('foo', function(a){
					expect(this.as.hi).to.be(1);
					if('a' == a.node){
						done.a = true;
					} else {
						expect(done.a).to.be.ok();
						done();
					}
				}, {hi: 1}).on.on('foo', {field: 'where', node: {a: 1, b: 2}});
			});
			it('synchronous async', function(done){
				var e = {on: Gun.on};
				e.on('foo', function(a){
					expect(a.b).to.be(5);
					done.first = true;
					this.to.next(a);
				});
				e.on('foo', function(a, ev){
					expect(a.b).to.be(5);
					done.second = true;
					var to = this.to;
					setTimeout(function() {
						to.next({c: 9, again: a.again});
					},100);
				});
				e.on('foo', function(a){
					this.off();
					expect(a.again).to.not.be.ok();
					expect(a.c).to.be(9);
					expect(done.first).to.be.ok();
					expect(done.second).to.be.ok();
					done();
				}).on.on('foo', {b: 5}).on.on('foo', {b:5, again: true});
			});
		});
		describe('flow', function() {
			var i = 0;
			function flow(){
				var f = function(arg){
					var cb = f.cb? f.cb.fn : f.fn;
					if(cb){
						f.cb = cb;
						var ff = flow();
						ff.f = f;
						cb(ff);
						return;
					}
					if(f.f){
						f.f(arg);
						f.cb = 0;
						return;
					}
				}, cb;
				f.flow = function(fn){
					cb = (cb || f).fn = fn;
					return f;
				};
				return f;
			}
			it('intermittent interruption', function(done){
				var f = flow();
				//var f = {flow: flow}
				f.flow(function(f){
					//console.log(1);
					f.flow(function(f){
						//console.log(2);
						f({yes: 'please'});
					});
					setTimeout(function() {
						f.flow(function(f){
							//console.log(2.1);
							f({forever: 'there'});
						});
						f({strange: 'places'});
						//console.log("-----");
						f({earlier: 'location'});
					},100);
				});
				f.flow(function(f){
					//console.log(3);
					f({ok: 'now'});
				});
				f.flow(function(f){
					//console.log(4);
					done();
				});
				setTimeout(function() {
					f({hello: 'world'});
				}, 100);
			});

			/*

			Why is there code here to mutate `Gun` outside of a test?

			*/
			// ;(function(exports){
			// 	function next(arg){ var n = this;
			// 		if(arg instanceof Function){
			// 			if(!n.fn){ return n.fn = arg, n }
			// 			var f = {next: next, fn: arg, first: n.first || n};
			// 			n.last = (n.last || n).to = f;
			// 			return n;
			// 		}
			// 		if(n.fn){
			// 			var sub = {next: next, from: n.to || (n.first || {}).from};
			// 			n.fn(sub);
			// 			return;
			// 		}
			// 		if(n.from){
			// 			n.from.next(arg);
			// 			return;
			// 		}
			// 	}
			// 	exports.next = next;
			// }(Gun));

			it('intermittent interruptions', function(done){
				//var f = flow();
				var f = {next: Gun.next}; // for now
				f.next(function(f){
					//console.log(1, f);
					f.next(function(f){
						//console.log(2, f);
						f.next({yes: 'please'});
					});
					setTimeout(function() {
						f.next(function(f){
							//console.log(2.1, f);
							f.next({forever: 'there'});
						});
						f.next({strange: 'places'});
						//console.log("-----");
						f.next({earlier: 'location'});
					},100);
				});
				f.next(function(f){
					//console.log(3);
					f.next({ok: 'now'});
				});
				f.next(function(f){
					//console.log(4);
					if(!done.a){ return done.a = true }
					done();
				});
				setTimeout(function() {
					f.next({hello: 'world'});
				}, 100);
			});
		});
		describe('Gun Safety', function() {
			/* WARNING NOTE: Internal API has significant breaking changes! */

			var gun = Gun();
			it('is', function() {
				expect(Gun.is(gun)).to.be(true);
				expect(Gun.is(true)).to.be(false);
				expect(Gun.is(false)).to.be(false);
				expect(Gun.is(0)).to.be(false);
				expect(Gun.is(1)).to.be(false);
				expect(Gun.is('')).to.be(false);
				expect(Gun.is('a')).to.be(false);
				expect(Gun.is(Infinity)).to.be(false);
				expect(Gun.is(NaN)).to.be(false);
				expect(Gun.is([])).to.be(false);
				expect(Gun.is([1])).to.be(false);
				expect(Gun.is({})).to.be(false);
				expect(Gun.is({a:1})).to.be(false);
				expect(Gun.is(function() {})).to.be(false);
			});
			it('is value', function() {
				expect(Gun.val.is(false)).to.be(true);
				expect(Gun.val.is(true)).to.be(true);
				expect(Gun.val.is(0)).to.be(true);
				expect(Gun.val.is(1)).to.be(true);
				expect(Gun.val.is('')).to.be(true);
				expect(Gun.val.is('a')).to.be(true);
				expect(Gun.val.is({'#':'somesoulidhere'})).to.be('somesoulidhere');
				expect(Gun.val.is({'#':'somesoulidhere', and: 'nope'})).to.be(false);
				expect(Gun.val.is(Infinity)).to.be(false); // boohoo :(
				expect(Gun.val.is(NaN)).to.be(false);
				expect(Gun.val.is([])).to.be(false);
				expect(Gun.val.is([1])).to.be(false);
				expect(Gun.val.is({})).to.be(false);
				expect(Gun.val.is({a:1})).to.be(false);
				expect(Gun.val.is(function() {})).to.be(false);
			});
			it('is link', function() {
				expect(Gun.val.link.is({'#':'somesoulidhere'})).to.be('somesoulidhere');
				expect(Gun.val.link.is({'#':'somethingelsehere'})).to.be('somethingelsehere');
				expect(Gun.val.link.is({'#':'somesoulidhere', and: 'nope'})).to.be(false);
				expect(Gun.val.link.is({or: 'nope', '#':'somesoulidhere'})).to.be(false);
				expect(Gun.val.link.is(false)).to.be(false);
				expect(Gun.val.link.is(true)).to.be(false);
				expect(Gun.val.link.is('')).to.be(false);
				expect(Gun.val.link.is('a')).to.be(false);
				expect(Gun.val.link.is(0)).to.be(false);
				expect(Gun.val.link.is(1)).to.be(false);
				expect(Gun.val.link.is(Infinity)).to.be(false); // boohoo :(
				expect(Gun.val.link.is(NaN)).to.be(false);
				expect(Gun.val.link.is([])).to.be(false);
				expect(Gun.val.link.is([1])).to.be(false);
				expect(Gun.val.link.is({})).to.be(false);
				expect(Gun.val.link.is({a:1})).to.be(false);
				expect(Gun.val.link.is(function() {})).to.be(false);
			});
			it.skip('is lex', function() {
				expect(Gun.is.lex({'#': 'soul'})).to.eql({soul: 'soul'});
				expect(Gun.is.lex({'.': 'field'})).to.eql({field: 'field'});
				expect(Gun.is.lex({'=': 'value'})).to.eql({value: 'value'});
				expect(Gun.is.lex({'>': 'state'})).to.eql({state: 'state'});
				expect(Gun.is.lex({'#': {'=': 'soul'}})).to.eql({soul: {'=': 'soul'}});
				expect(Gun.is.lex({'#': {'=': 'soul'}, '.': []})).to.be(false);
				expect(Gun.is.lex({'#': {'=': 'soul'}, 'asdf': 'oye'})).to.be(false);
				expect(Gun.is.lex()).to.be(false);
				expect(Gun.is.lex('')).to.be(false);
			});
			it.skip('is lex ify', function() {
				expect(Gun.is.lex.ify({'#': 'soul', '.': 'field', soul: 'foo', field: 'field', state: 0})).to.eql({'#': 'soul', '.': 'field', '>': 0});
			});
			it('is node', function() {
				var n;
				expect(Gun.node.is({_:{'#':'somesoulidhere'}})).to.be(true);
				expect(Gun.node.is(n = {_:{'#':'somesoulidhere'}, a:0, b: 1, c: '', d: 'e', f: {'#':'somethingelsehere'}})).to.be(true);
				expect(Gun.node.is({_:{'#':'somesoulidhere'}, a:0, b: 1, c: '', d: 'e', f: {'#':'somethingelsehere'}, g: Infinity})).to.be(false);
				expect(Gun.node.is({_:{'#':'somesoulidhere'}, a:0, b: 1, z: NaN, c: '', d: 'e'})).to.be(false);
				expect(Gun.node.is({_:{'#':'somesoulidhere'}, a:0, b: 1, y: {_: 'cool'}, c: '', d: 'e'})).to.be(false);
				expect(Gun.node.is({_:{'#':'somesoulidhere'}, a:0, b: 1, x: [], c: '', d: 'e'})).to.be(false);
				expect(Gun.node.is({})).to.be(false);
				expect(Gun.node.is({a:1})).to.be(false);
				expect(Gun.node.is({_:{}})).to.be(false);
				expect(Gun.node.is({_:{}, a:1})).to.be(false);
				expect(Gun.node.is({'#':'somesoulidhere'})).to.be(false);
				Gun.node.is(n, function(v,f){
					//console.log("v/f", v,f);
				});
			});
			it('is graph', function() {
				var g;
				expect(Gun.graph.is({'somesoulidhere': {_:{'#':'somesoulidhere'}}})).to.be(true);
				expect(Gun.graph.is(g = {'somesoulidhere': {_:{'#':'somesoulidhere'}}, 'somethingelsehere': {_:{'#':'somethingelsehere'}}})).to.be(true);
				expect(Gun.graph.is({'somesoulidhere': {_:{'#':'somesoulidhere'}, a:0, b: 1, c: '', d: 'e', f: {'#':'somethingelsehere'}}, 'somethingelsehere': {_:{'#':'somethingelsehere'}}})).to.be(true);
				expect(Gun.graph.is({'somesoulidhere': {_:{'#':'somesoulidhere'}, a:0, b: 1, c: '', d: 'e', f: {'#':'somethingelsehere'}}})).to.be(true);
				expect(Gun.graph.is({'somesoulidhere': {_:{'#':'somesoulidhere'}, a:0, b: 1, c: '', d: 'e', f: {'#':'somethingelsehere'}}, foo: 1, 'somethingelsehere': {_:{'#':'somethingelsehere'}}})).to.be(false);
				expect(Gun.graph.is({'somesoulidhere': {_:{'#':'somesoulidhere'}, a:0, b: 1, c: '', d: 'e', f: {'#':'somethingelsehere'}}, foo: {}, 'somethingelsehere': {_:{'#':'somethingelsehere'}}})).to.be(false);
				expect(Gun.graph.is({'somesoulidhere': {_:{'#':'somesoulidhere'}, a:0, b: 1, c: '', d: 'e', f: {'#':'somethingelsehere'}}, foo: {_:{'#':'FOO'}}, 'somethingelsehere': {_:{'#':'somethingelsehere'}}})).to.be(false);
				expect(Gun.graph.is({'somesoulidhere': {_:{'#':'somesoulidhere'}, a:0, b: 1, c: '', d: 'e', f: {'#':'somethingelsehere'}}, foo: {_:{}}, 'somethingelsehere': {_:{'#':'somethingelsehere'}}})).to.be(false);
				expect(Gun.graph.is({'somesoulidhere': {_:{'#':'somesoulidhere'}, a:0, b: Infinity, c: '', d: 'e', f: {'#':'somethingelsehere'}}})).to.be(false);
				expect(Gun.graph.is({'somesoulidhere': {_:{'#':'somesoulidhere'}, a:0, b: Infinity, c: '', d: 'e', f: {'#':'somethingelsehere'}}, 'somethingelsehere': {_:{'#':'somethingelsehere'}}})).to.be(false);
				expect(Gun.graph.is({_:{'#':'somesoulidhere'}})).to.be(false);
				expect(Gun.graph.is({_:{'#':'somesoulidhere'}, a:0, b: 1, c: '', d: 'e', f: {'#':'somethingelsehere'}})).to.be(false);
				expect(Gun.graph.is({_:{'#':'somesoulidhere'}, a:0, b: 1, c: '', d: 'e', f: {'#':'somethingelsehere'}, g: Infinity})).to.be(false);
				expect(Gun.graph.is({_:{'#':'somesoulidhere'}, a:0, b: 1, z: NaN, c: '', d: 'e'})).to.be(false);
				expect(Gun.graph.is({_:{'#':'somesoulidhere'}, a:0, b: 1, y: {_: 'cool'}, c: '', d: 'e'})).to.be(false);
				expect(Gun.graph.is({_:{'#':'somesoulidhere'}, a:0, b: 1, x: [], c: '', d: 'e'})).to.be(false);
				expect(Gun.graph.is({})).to.be(false); // Empty graph is not a graph :(
				expect(Gun.graph.is({a:1})).to.be(false);
				expect(Gun.graph.is({_:{}})).to.be(false);
				expect(Gun.graph.is({_:{}, a:1})).to.be(false);
				expect(Gun.graph.is({'#':'somesoulidhere'})).to.be(false);
				Gun.graph.is(g, function(n,s){
					//console.log("node/soul", n,s);
				});
			});
			it('graph ify', function(done){
				function map(v,f,n){
					done.m = true;
				}
				var graph = Gun.graph.ify({
					_: {'#': 'yay'},
					a: 1
				}, map);
				expect(graph).to.eql({
					yay: {
						_: {'#': 'yay'},
						a: 1
					}
				});
				expect(done.m).to.be.ok();
				var graph = Gun.graph.ify({
					_: {'#': 'yay', '>': {a: 9}},
					a: 1
				}, map);
				expect(graph).to.eql({
					yay: {
						_: {'#': 'yay', '>': {a: 9}},
						a: 1
					}
				});
				var map = Gun.state.map(map, 9);
				var graph = Gun.graph.ify({
					_: {'#': 'yay', '>': {a: 1}},
					a: 1
				}, map);
				expect(graph).to.eql({
					yay: {
						_: {'#': 'yay', '>': {a: 9}},
						a: 1
					}
				});
				var graph = Gun.graph.ify({a:1});
				Gun.obj.map(graph, function(node){
					expect(node._['#']).to.be.ok();
				});

				var alice = {_:{'#':'ASDF'}, age: 27, name: "Alice"};
				var bob = {_:{'#':'DASF'}, age: 29, name: "Bob"};
				var cat = {_:{'#':'FDSA'}, name: "Fluffy", species: "kitty"};
				alice.spouse = bob;
				bob.spouse = alice;
				alice.pet = cat;
				cat.slave = bob;
				cat.master = alice;
				var graph = Gun.graph.ify(bob);
				expect(graph).to.eql({
					'ASDF': {_:{'#':'ASDF'},
						age: 27,
						name: "Alice",
						spouse: {'#':'DASF'},
						pet: {'#':'FDSA'}
					},
					'DASF': {_:{'#':'DASF'},
						age: 29,
						name: 'Bob',
						spouse: {'#':'ASDF'},
					},
					'FDSA': {_:{'#':'FDSA'},
						name: "Fluffy",
						species: "kitty",
						slave: {'#':'DASF'},
						master: {'#':'ASDF'}
					}
				});

				done();
			});
		});
	});
	describe('ify', function() {
		console.log("TODO: BUG! Upgrade IFY tests to new internal API!");
		return;

		var test, gun = Gun();

		it('null', function(done){
			Gun.ify(null, function(err, ctx){
				expect(err).to.be.ok();
				done();
			});
		});

		it('basic', function(done){
			var data = {a: false, b: true, c: 0, d: 1, e: '', f: 'g', h: null};
			Gun.ify(data, function(err, ctx){
				expect(err).to.not.be.ok();
				expect(ctx.err).to.not.be.ok();
				expect(ctx.root).to.eql(data);
				expect(ctx.root === data).to.not.ok();
				done();
			}, {pure: true});
		});

		it('basic soul', function(done){
			var data = {_: {'#': 'SOUL'}, a: false, b: true, c: 0, d: 1, e: '', f: 'g', h: null};
			Gun.ify(data, function(err, ctx){
				expect(err).to.not.be.ok();
				expect(ctx.err).to.not.be.ok();

				expect(ctx.root).to.eql(data);
				expect(ctx.root === data).to.not.be.ok();
				expect(Gun.node.soul(ctx.root) === Gun.node.soul(data));
				done();
			}, {pure: true});
		});

		it('arrays', function(done){
			var data = {before: {path: 'kill'}, one: {two: {lol: 'troll', three: [9, 8, 7, 6, 5]}}};
			Gun.ify(data, function(err, ctx){
				expect(err).to.be.ok();
				expect((err.err || err).indexOf("one.two.three")).to.not.be(-1);
				done();
			});
		});

		it('undefined', function(done){
			var data = {z: undefined, x: 'bye'};
			Gun.ify(data, function(err, ctx){
				expect(err).to.be.ok();
				done();
			});
		});

		it('NaN', function(done){
			var data = {a: NaN, b: 2};
			Gun.ify(data, function(err, ctx){
				expect(err).to.be.ok();
				done();
			});
		});

		it('Infinity', function(done){ // SAD DAY PANDA BEAR :( :( :(... Mark wants Infinity. JSON won't allow.
			var data = {a: 1, b: Infinity};
			Gun.ify(data, function(err, ctx){
				expect(err).to.be.ok();
				done();
			});
		});

		it('function', function(done){
			var data = {c: function() {}, d: 'hi'};
			Gun.ify(data, function(err, ctx){
				expect(err).to.be.ok();
				done();
			});
		});

		it('extraneous', function(done){
			var data = {_: {'#': 'shhh', meta: {yay: 1}}, sneak: true};
			Gun.ify(data, function(err, ctx){
				expect(err).to.not.be.ok(); // extraneous metadata needs to be stored, but it can't be used for data.
				done();
			});
		});

		it('document', function(done){
			var data = {users: {1: {where: {lat: Math.random(), lng: Math.random(), i: 1}}}};
			Gun.ify(data, function(err, ctx){
				var soul, node;
				expect(soul = Gun.val.link.is(ctx.root.users)).to.be.ok();
				node = ctx.graph[soul];
				expect(soul = Gun.val.link.is(node[1])).to.be.ok();
				node = ctx.graph[soul];
				expect(soul = Gun.val.link.is(node.where)).to.be.ok();
				node = ctx.graph[soul];
				expect(node.lat).to.be.ok();
				expect(node.lng).to.be.ok();
				expect(node.i).to.be(1);
				done();
			});
		});

		return; // TODO! Fix GUN to handle this!
		data = {};
		data.sneak = false;
		data.both = {inside: 'meta data'};
		data._ = {'#': 'shhh', data: {yay: 1}, spin: data.both};
		test = Gun.ify(data);
		expect(test.err.meta).to.be.ok(); // TODO: Fail: this passes, somehow? Fix ify code!
	});

	describe.skip('Schedule', function() {
		console.log("TODO: BUG! Upgrade SCHEDULE tests to new internal API!");

		it('one', function(done){
			Gun.schedule(Gun.time.is(), function() {
				expect(true).to.be(true);
				done(); //setTimeout(function() { done() },1);
			});
		});

		it('many', function(done){
			Gun.schedule(Gun.time.is() + 50, function() {
				done.first = true;
			});
			Gun.schedule(Gun.time.is() + 100, function() {
				done.second = true;
			});
			Gun.schedule(Gun.time.is() + 200, function() {
				done.third = true;
				expect(done.first).to.be(true);
				expect(done.second).to.be(true);
				expect(done.third).to.be(true);
				done(); //setTimeout(function() { done() },1);
			});
		});
	});

	describe.skip('Union', function() {
		console.log("TODO: BUG! Upgrade UNION tests to new internal API!");

		var gun = Gun();

		it('fail', function() {
			var prime = {
				'asdf': {
					_: {'#': 'asdf', '>':{
						a: 'cheating'
					}},
					a: 0
				}
			}

			expect(gun.__.graph['asdf']).to.not.be.ok();
			var ctx = Gun.HAM.graph(gun, prime);
			expect(ctx).to.not.be.ok();
		});

		it('basic', function(done){
			var prime = {
				'asdf': {
					_: {'#': 'asdf', '>':{
						a: Gun.time.is()
					}},
					a: 0
				}
			}

			expect(gun.__.graph['asdf']).to.not.be.ok();
			var ctx = Gun.union(gun, prime, function() {
				expect(gun.__.graph['asdf'].a).to.be(0);
				done();
			});
		});

		it('disjoint', function(done){
			var prime = {
				'asdf': {
					_: {'#': 'asdf', '>':{
						b: Gun.time.is()
					}},
					b: 'c'
				}
			}

			expect(gun.__.graph['asdf'].a).to.be(0);
			expect(gun.__.graph['asdf'].b).to.not.be.ok();
			var ctx = Gun.union(gun, prime, function() {
				expect(gun.__.graph['asdf'].a).to.be(0);
				expect(gun.__.graph['asdf'].b).to.be('c');
				done();
			});
		});

		it('mutate', function(done){
			var prime = {
				'asdf': {
					_: {'#': 'asdf', '>':{
						b: Gun.time.is()
					}},
					b: 'd'
				}
			}

			expect(gun.__.graph['asdf'].b).to.be('c');
			var ctx = Gun.union(gun, prime, function() {
				expect(gun.__.graph['asdf'].b).to.be('d');
				done();
			});
		});

		it('disjoint past', function(done){
			var prime = {
				'asdf': {
					_: {'#': 'asdf', '>':{
						x: 0 // beginning of time!
					}},
					x: 'hi'
				}
			}
			expect(gun.__.graph['asdf'].x).to.not.be.ok();
			var ctx = Gun.union(gun, prime, function() {
				expect(gun.__.graph['asdf'].x).to.be('hi');
				done();
			});
		});

		it('past', function(done){
			var prime = {
				'asdf': {
					_: {'#': 'asdf', '>':{
						x: Gun.time.is() - (60 * 1000) // above lower boundary, below now or upper boundary.
					}},
					x: 'hello'
				}
			}

			expect(gun.__.graph['asdf'].x).to.be('hi');
			var ctx = Gun.union(gun, prime, function() {
				expect(gun.__.graph['asdf'].x).to.be('hello');
				done();
			});
		});

		it('future', function(done){
			var prime = {
				'asdf': {
					_: {'#': 'asdf', '>':{
						x: Gun.time.is() + (200) // above now or upper boundary, aka future.
					}},
					x: 'how are you?'
				}
			}

			expect(gun.__.graph['asdf'].x).to.be('hello');
			var now = Gun.time.is();
			var ctx = Gun.union(gun, prime, function() {
				expect(Gun.time.is() - now).to.be.above(100);
				expect(gun.__.graph['asdf'].x).to.be('how are you?');
				done();
			});
		});
		var to = 5000;
		it('disjoint future', function(done){
			var prime = {
				'asdf': {
					_: {'#': 'asdf', '>':{
						y: Gun.time.is() + (200) // above now or upper boundary, aka future.
					}},
					y: 'goodbye'
				}
			}
			expect(gun.__.graph['asdf'].y).to.not.be.ok();
			var now = Gun.time.is();
			var ctx = Gun.union(gun, prime, function() {
				expect(Gun.time.is() - now).to.be.above(100);
				expect(gun.__.graph['asdf'].y).to.be('goodbye');
				done();
			});
		});

		it('disjoint future max', function(done){
			var prime = {
				'asdf': {
					_: {'#': 'asdf', '>':{
						y: Gun.time.is() + (2), // above now or upper boundary, aka future.
						z: Gun.time.is() + (200) // above now or upper boundary, aka future.
					}},
					y: 'bye',
					z: 'who'
				}
			}

			expect(gun.__.graph['asdf'].y).to.be('goodbye');
			expect(gun.__.graph['asdf'].z).to.not.be.ok();
			var now = Gun.time.is();
			var ctx = Gun.union(gun, prime, function() {
				expect(Gun.time.is() - now).to.be.above(100);
				expect(gun.__.graph['asdf'].y).to.be('bye');
				expect(gun.__.graph['asdf'].z).to.be('who');
				done(); //setTimeout(function() { done() },1);
			});
		});

		it('future max', function(done){
			var prime = {
				'asdf': {
					_: {'#': 'asdf', '>':{
						w: Gun.time.is() + (2), // above now or upper boundary, aka future.
						x: Gun.time.is() - (60 * 1000), // above now or upper boundary, aka future.
						y: Gun.time.is() + (200), // above now or upper boundary, aka future.
						z: Gun.time.is() + (50) // above now or upper boundary, aka future.
					}},
					w: true,
					x: 'nothing',
					y: 'farewell',
					z: 'doctor who'
				}
			}

			expect(gun.__.graph['asdf'].w).to.not.be.ok();
			expect(gun.__.graph['asdf'].x).to.be('how are you?');
			expect(gun.__.graph['asdf'].y).to.be('bye');
			expect(gun.__.graph['asdf'].z).to.be('who');
			var now = Gun.time.is();
			var ctx = Gun.union(gun, prime, function() {
				expect(Gun.time.is() - now).to.be.above(100);
				expect(gun.__.graph['asdf'].w).to.be(true);
				expect(gun.__.graph['asdf'].x).to.be('how are you?');
				expect(gun.__.graph['asdf'].y).to.be('farewell');
				expect(gun.__.graph['asdf'].z).to.be('doctor who');
				done(); //setTimeout(function() { done() },1);
			});
		});

		it('two nodes', function(done){ // chat app problem where disk dropped the last data, turns out it was a union problem!
			var state = Gun.time.is();
			var prime = {
				'sadf': {
					_: {'#': 'sadf', '>':{
						1: state
					}},
					1: {'#': 'fdsa'}
				},
				'fdsa': {
					_: {'#': 'fdsa', '>':{
						msg: state
					}},
					msg: "Let's chat!"
				}
			}

			expect(gun.__.graph['sadf']).to.not.be.ok();
			expect(gun.__.graph['fdsa']).to.not.be.ok();
			var ctx = Gun.union(gun, prime, function() {
				expect(gun.__.graph['sadf'][1]).to.be.ok();
				expect(gun.__.graph['fdsa'].msg).to.be("Let's chat!");
				done();
			});
		});

		it('append third node', function(done){ // chat app problem where disk dropped the last data, turns out it was a union problem!
			var state = Gun.time.is();
			var prime = {
				'sadf': {
					_: {'#': 'sadf', '>':{
						2: state
					}},
					2: {'#': 'fads'}
				},
				'fads': {
					_: {'#': 'fads', '>':{
						msg: state
					}},
					msg: "hi"
				}
			}

			expect(gun.__.graph['sadf']).to.be.ok();
			expect(gun.__.graph['fdsa']).to.be.ok();
			var ctx = Gun.union(gun, prime, function() {
				expect(gun.__.graph['sadf'][1]).to.be.ok();
				expect(gun.__.graph['sadf'][2]).to.be.ok();
				expect(gun.__.graph['fads'].msg).to.be("hi");
				done();
			});
		});

		it('ify null', function() {
				var node = Gun.union.ify(null, 'pseudo');
				expect(Gun.node.soul(node)).to.be('pseudo');
		});

		it('ify node', function() {

			var graph = {
				'asdf': {
					_: {'#': 'asdf', '>': {
						x: Gun.time.is(),
						y: Gun.time.is()
					}},
					x: 1,
					y: 2
				},
				'soul': {
					_: {'#': 'soul', '~': 1, '>': {
						'asdf': Gun.time.is()
					}},
					'asdf': {'#': 'asdf'}
				}
			}
			var node = Gun.union.ify(graph, 'soul');
			expect(Gun.node.soul(node)).to.be('soul');
			expect(node.x).to.be(1);
			expect(node.y).to.be(2);
		});

		it('ify graph', function() {
			var graph = {
				'asdf': {
					_: {'#': 'asdf', '>': {
						a: Gun.time.is() - 2,
						z: Gun.time.is() - 2
					}},
					a: 1,
					z: 1
				},
				'fdsa': {
					_: {'#': 'fdsa', '>': {
						b: Gun.time.is() - 1,
						z: Gun.time.is() - 1
					}},
					b: 2,
					z: 2
				},
				'sadf': {
					_: {'#': 'sadf', '>': {
						c: Gun.time.is(),
						z: Gun.time.is() - 100
					}},
					c: 3,
					z: 3
				},
				'soul': {
					_: {'#': 'soul', '~': 1, '>': {
						'asdf': Gun.time.is(),
						'fdsa': Gun.time.is(),
						'sadf': Gun.time.is()
					}},
					'asdf': {'#': 'asdf'},
					'fdsa': {'#': 'fdsa'},
					'sadf': {'#': 'sadf'}
				}
			}
			var node = Gun.union.ify(graph, 'soul');
			expect(Gun.node.soul(node)).to.be('soul');
			expect(node.a).to.be(1);
			expect(node.b).to.be(2);
			expect(node.c).to.be(3);
			expect(node.z).to.be(2);
		});
	});

	describe('API', function() {
		var gopt = {wire:{put:function(n,cb){cb()},get:function(k,cb){cb()}}};
		if(Gun.window && location.search){
			/*console.log("LOCALHOST PEER MUST BE ON!");
			var peer = {url: 'http://localhost:8765/gun'};
			Gun.on('opt', function(root){
				if(root.opt.test_no_peer){ return this.to.next(root) }
				root.opt.peers = root.opt.peers || {};
				root.opt.peers['http://localhost:8765/gun'] = peer;
				this.to.next(root);
			});*/
		}
		var gun = Gun();

		it.skip('gun chain separation', function(done){ // TODO: UNDO!
			var gun = Gun();

			var c1 = gun.put({hello: 'world'});

			var c2 = gun.put({hi: 'earth'});

			c1.on(function(val){
				expect(val.hi).to.not.be.ok();
			});

			c2.on(function(val){
				expect(val.hello).to.not.be.ok();
				if(done.c){ return }
				done(); done.c = 1;
			});
		});

		describe.skip('timeywimey', function() { // TODO: UNDO!

			it('kitty', function(done){
				var g1 = gun.put({hey: 'kitty'}).key('timeywimey/kitty');

				var g2 = gun.get('timeywimey/kitty').on(function(val){
					delete val._;
					//console.log("kitty?", val);
					expect(val.hey).to.be('kitty');
					expect(val.hi).to.not.be.ok();
					expect(val.hello).to.not.be.ok();
					expect(val.foo).to.not.be.ok();
					if(done.c){ return }
					done(); done.c = 1;
				});
			});

			it('kitty puppy', function(done){
				var g3 = gun.put({hey: 'kitty'}).key('timeywimey/kitty/puppy');

				var g4 = gun.put({hi: 'puppy'}).key('timeywimey/kitty/puppy');

				var g5 = gun.get('timeywimey/kitty/puppy').on(function(val){
					//delete val._;
					//console.log("puppy?", val);
					expect(val.hey).to.be('kitty');
					expect(val.hi).to.be('puppy');
					if(done.c){ return }
					done(); done.c = 1;
				});
			});

			it('hello', function(done){
				gun.get('timeywimey/hello').on(function(val){
					//delete val._;
					//console.log("hello?", val);
					expect(val.hello).to.be('world');
					if(done.c){ return }
					done(); done.c = 1;
				});

				gun.put({hello: 'world'}).key('timeywimey/hello');
			});

			it('hello foo', function(done){
				gun.get('timeywimey/hello/foo').on(function(val){
					//delete val._;
					expect(val.hello).to.be('world');
					if(val.foo){
						expect(val.foo).to.be('bar');
						if(done.c){ return }
						done(); done.c = 1;
					}
				});

				gun.put({hello: 'world'}).key('timeywimey/hello/foo');

				gun.put({foo: 'bar'}).key('timeywimey/hello/foo');
			});

			it('all', function(done){
				gun.put({hey: 'kitty'}).key('timeywimey/all');

				gun.put({hi: 'puppy'}).key('timeywimey/all');

				gun.get('timeywimey/all').on(function(val){
					// console.log('all', done.c, val);
					expect(val.hey).to.be('kitty');
					expect(val.hi).to.be('puppy');
					if(val.hello){
						expect(val.hello).to.be('world');
						done.hello = true;
					}
					if(val.foo){
						expect(val.foo).to.be('bar');
						if(done.c || !done.hello){ return }
						done(); done.c = 1;
					}
				});

				gun.put({hello: 'world'}).key('timeywimey/all');

				gun.put({foo: 'bar'}).key('timeywimey/all');
			});

		});

		describe('plural chains', function() {
			this.timeout(9000);
			it('uncached synchronous map on', function(done){
				/*
					Biggest challenges so far:
					 - Unsubscribe individual mapped next. !
					 - Performance deduplication on asking relation's next. !
					 - Replying immediately to parent cached contexts.
					 - Performant read lock on write contexts.
					 - Proxying event across maps.
				*/
				var s = Gun.state.map();s.soul = 'u/m';
				gun.on('put', {$: gun, put: Gun.graph.ify({
					alice: {
						age: 26,
						name: "Alice",
						pet: {a:1, name: "Fluffy"}
					},
					bob: {
						age: 29,
						name: "Bob!",
						pet: {b:2, name: "Frisky"}
					}
				}, s)});
				var check = {}, count = {};
				gun.get('u/m').map().on(function(v,f){
					check[f] = v;
					count[f] = (count[f] || 0) + 1;
					//console.log("***********", f, v);
					if(check.alice && check.bob){
						clearTimeout(done.to);
						done.to = setTimeout(function() {
							expect(check.alice.age).to.be(26);
							expect(check.alice.name).to.be('Alice');
							expect(Gun.val.link.is(check.alice.pet)).to.be.ok();
							//expect(count.alice).to.be(1);
							expect(check.bob.age).to.be(29);
							expect(check.bob.name).to.be('Bob!');
							expect(Gun.val.link.is(check.bob.pet)).to.be.ok();
							//expect(count.bob).to.be(1);
							done();
						},10);
					}
				});
			});

			it('uncached synchronous map get on', function(done){
				var s = Gun.state.map();s.soul = 'u/m/p';
				gun.on('put', {$: gun, put: Gun.graph.ify({
					alice: {
						age: 26,
						name: "alice",
						pet: {a:1, name: "Fluffy"}
					},
					bob: {
						age: 29,
						name: "bob",
						pet: {b:2, name: "Frisky"}
					}
				}, s)});
				var check = {}, count = {};
				gun.get('u/m/p').map().get('name').on(function(v,f){
					//console.log("*****************", f, v);
					check[v] = f;
					count[v] = (count[v] || 0) + 1;
					if(check.alice && check.bob){
						clearTimeout(done.to);
							done.to = setTimeout(function() {
							expect(check.alice).to.be('name');
							expect(check.bob).to.be('name');
							//expect(count.alice).to.be(1);
							//expect(count.bob).to.be(1);
							done();
						},10);
					}
				});
			});

			it('uncached synchronous map get on node', function(done){
				var s = Gun.state.map();s.soul = 'u/m/p/n';
				gun.on('put', {$: gun, put: Gun.graph.ify({
					alice: {
						age: 26,
						name: "alice",
						pet: {a:1, name: "Fluffy"}
					},
					bob: {
						age: 29,
						name: "bob",
						pet: {b:2, name: "Frisky"}
					}
				}, s)});
				var check = {}, count = {};
				gun.get('u/m/p/n').map().get('pet').on(function(v,f){
					//console.log("********************", f,v);
					check[v.name] = v;
					count[v.name] = (count[v.name] || 0) + 1;
					if(check.Fluffy && check.Frisky){
						clearTimeout(done.to);
							done.to = setTimeout(function() {
							expect(check.Fluffy.a).to.be(1);
							expect(check.Frisky.b).to.be(2);
							//expect(count.Fluffy).to.be(1);
							//expect(count.Frisky).to.be(1);
							//expect(count['undefined']).to.not.be.ok();
							if(done.c){return}done.c=1;
							done();
						},10);
					}
				});
			});

			it('uncached synchronous map get on node get', function(done){
				var gun = Gun();
				var s = Gun.state.map();s.soul = 'u/m/p/n/p';
				gun.on('put', {$: gun, put: Gun.graph.ify({
					alice: {
						age: 26,
						name: "alice",
						pet: {a:1, name: "Fluffy"}
					},
					bob: {
						age: 29,
						name: "bob",
						pet: {b:2, name: "Frisky"}
					}
				}, s)});
				var check = {}, count = {};
				//console.debug.i=1;console.log('-------------------');
				gun.get('u/m/p/n/p').map().get('pet').get('name').on(function(v,f){
					check[v] = f;
					count[v] = (count[v] || 0) + 1;
					//console.log("*****************", f, v);
					if(check.Fluffy && check.Frisky){
						clearTimeout(done.to);
						done.to = setTimeout(function() {
							expect(check.Fluffy).to.be('name');
							expect(check.Frisky).to.be('name');
							//console.log("????", gun._.graph);
							Gun.obj.map(gun._.graph, function(n,s){
								if('u/m/p/n/p' === s){ return }
								var a = Gun.obj.map(n, function(v,f,t){t(v)});
								expect(a.length).to.be(2); // make sure that ONLY the selected properties were loaded, not the whole node.
							});
							//expect(count.Fluffy).to.be(1);
							//expect(count.Frisky).to.be(1);
							done();
						},10);
					}
				});
			});

			it('uncached synchronous map on mutate', function(done){
				var s = Gun.state.map();s.soul = 'u/m/mutate';
				gun.on('put', {$: gun, put: Gun.graph.ify({
					alice: {
						age: 26,
						name: "Alice",
						pet: {a:1, name: "Fluffy"}
					},
					bob: {
						age: 29,
						name: "Bob",
						pet: {b:2, name: "Frisky"}
					}
				}, s)});
				var check = {}, count = {};
				gun.get('u/m/mutate').map().get('name').get(function(at,ev){
					var e = at.err, v = at.put, f = at.get;
					//console.log("****************", f,v);
					check[v] = f;
					count[v] = (count[v] || 0) + 1;
					if(check.Alice && check.Bob && check['undefined']){
						clearTimeout(done.to);
						done.to = setTimeout(function() {
							//expect(count.Alice).to.be(1);
							//expect(count.Bob).to.be(1);
							//expect(count['undefined']).to.be(1);
							if(done.c){ return } done.c = 1;
							done();
						},10);
					}
				});
				setTimeout(function() {
					gun.get('u/m/mutate').get('alice').put(7);
				}, 300);
			});

			it('uncached synchronous map on mutate node', function(done){
				var s = Gun.state.map();s.soul = 'u/m/mutate/n';
				gun.on('put', {$: gun, put: Gun.graph.ify({
					alice: {_:{'#':'umaliceo'},
						age: 26,
						name: "Alice",
						pet: {a:1, name: "Fluffy"}
					},
					bob: {
						age: 29,
						name: "Bob",
						pet: {b:2, name: "Frisky"}
					}
				}, s)});
				var check = {}, count = {};
				gun.get('u/m/mutate/n').map().get('name').get(function(at,ev){
					var e = at.err, v = at.put, f = at.get;
					check[v] = f;
					count[v] = (count[v] || 0) + 1;
					//console.log("************", f,v);
					if(check.Alice && check.Bob && check['undefined'] && check['Alice Zzxyz']){
						clearTimeout(done.to);
						done.to = setTimeout(function() {
							expect(done.last).to.be.ok();
							expect(check['Alice Aabca']).to.not.be.ok();
							//expect(count.Alice).to.be(1);
							//expect(count.Bob).to.be(1);
							//expect(count['undefined']).to.be(1);
							//expect(count['Alice Zzxyz']).to.be(1);
							done();
						},200);
					}
				});
				setTimeout(function() {
					gun.get('u/m/mutate/n').get('alice').put({
						_:{'#':'u/m/m/n/soul'},
						name: 'Alice Zzxyz'
					});
					setTimeout(function() {
						gun.get('umaliceo').put({
							name: 'Alice Aabca'
						});
						done.last = true;
					}, 10);
				}, 300);
			});

			it('uncached synchronous map on mutate node uncached', function(done){
				var s = Gun.state.map();s.soul = 'u/m/mutate/n/u';
				gun.on('put', {$: gun, put: Gun.graph.ify({
					alice: {_:{'#':'umaliceo1'},
						age: 26,
						name: "Alice",
						pet: {a:1, name: "Fluffy"}
					},
					bob: {
						age: 29,
						name: "Bob",
						pet: {b:2, name: "Frisky"}
					}
				}, s)});
				var check = {}, count = {};
				gun.get('u/m/mutate/n/u').map().on(function(v,f){
					check[v.name] = f;
					count[v.name] = (count[v.name] || 0) + 1;
					if(check.Alice && check.Bob && check['Alice Zzxyz']){
						clearTimeout(done.to);
						//console.log("****", f, v)
						done.to = setTimeout(function() {
							expect(done.last).to.be.ok();
							//expect(check['Alice Aabca']).to.not.be.ok();
							//expect(count['Alice']).to.be(1);
							//expect(count['Bob']).to.be(1);
							//expect(count['Alice Zzxyz']).to.be(1);
							if(done.c){ return } done.c = 1;
							done();
						},200);
					}
				});
				setTimeout(function() {
					var s = Gun.state.map();s.soul = 'u/m/m/n/u/soul';
					gun.on('put', {$: gun, put: Gun.graph.ify({
						name: 'Alice Zzxyz'
					}, s)});
					//console.debug.i=1;console.log("---------------");
					gun.get('u/m/mutate/n/u').put({
						alice: {'#':'u/m/m/n/u/soul'},
					});
					/*
						{
							users: {_:#users
								alice: {#newalice}
							}
						}
					*/
					setTimeout(function() {
						gun.get('umaliceo1').put({
							name: 'Alice Aabca'
						});
						done.last = true;
					}, 10);
				}, 300);
			});

			it('uncached synchronous map on get mutate node uncached', function(done){
				var s = Gun.state.map();s.soul = 'u/m/p/mutate/n/u';
				gun.on('put', {$: gun, put: Gun.graph.ify({
					alice: {_:{'#':'umaliceo2'},
						age: 26,
						name: "Alice",
						pet: {a:1, name: "Fluffy"}
					},
					bob: {
						age: 29,
						name: "Bob",
						pet: {b:2, name: "Frisky"}
					}
				}, s)});
				var check = {}, count = {};
				gun.get('u/m/p/mutate/n/u').map().get('name').on(function(v,f){
					check[v] = f;
					count[v] = (count[v] || 0) + 1;
					//console.log("*************", f,v);
					if(check.Alice && check.Bob && check['Alice Zzxyz']){
						clearTimeout(done.to);
						done.to = setTimeout(function() {
							var a = Gun.obj.map(gun._.graph['u/m/p/m/n/u/soul'], function(v,f,t){t(v)});
							expect(a.length).to.be(2);
							expect(done.last).to.be.ok();
							expect(check['Alice Aabca']).to.not.be.ok();
							//expect(count.Alice).to.be(1);
							//expect(count.Bob).to.be(1);
							//expect(count['Alice Zzxyz']).to.be(1);
							done();
						},200);
					}
				});
				setTimeout(function() {
					var s = Gun.state.map();s.soul = 'u/m/p/m/n/u/soul';
					gun.on('put', {$: gun, put: Gun.graph.ify({
						name: 'Alice Zzxyz', age: 34
					}, s)});
					gun.get('u/m/p/mutate/n/u').put({
						alice: {'#':'u/m/p/m/n/u/soul'},
					});
					setTimeout(function() {
						gun.get('umaliceo2').put({
							name: 'Alice Aabca'
						});
						done.last = true;
					}, 10);
				}, 300);
			});

			it('uncached synchronous map on get node mutate node uncached', function(done){
				var s = Gun.state.map();s.soul = 'u/m/p/n/mutate/n/u';
				gun.on('put', {$: gun, put: Gun.graph.ify({
					alice: {_:{'#':'umaliceo3'},
						age: 26,
						name: "Alice",
						pet: {_:{'#':'sflufso'},a:1, name: "Fluffy"}
					},
					bob: {
						age: 29,
						name: "Bob",
						pet: {b:2, name: "Frisky"}
					}
				}, s)});
				var check = {}, count = {};
				gun.get('u/m/p/n/mutate/n/u').map().get('pet').on(function(v,f){
					check[v.name] = f;
					count[v.name] = (count[v.name] || 0) + 1;
					//console.log("*****************", f,v);
					if(check.Fluffy && check.Frisky && check.Fuzzball){
						clearTimeout(done.to);
						done.to = setTimeout(function() {
							expect(done.last).to.be.ok();
							expect(check['Fluffs']).to.not.be.ok();
							//expect(count.Fluffy).to.be(1);
							//expect(count.Frisky).to.be(1);
							//expect(count.Fuzzball).to.be(1);
							done();
						},200);
					}
				});
				setTimeout(function() {
					var s = Gun.state.map();s.soul = 'alice/fuzz/soul';
					gun.on('put', {$: gun, put: Gun.graph.ify({
						name: 'Alice Zzxyz', age: 34,
						pet: {c:3, name: "Fuzzball"}
					}, s)});
					gun.get('u/m/p/n/mutate/n/u').put({
						alice: {'#':'alice/fuzz/soul'},
					});
					setTimeout(function() {
						gun.get('sflufso').put({
							name: 'Fluffs'
						});
						done.last = true;
					}, 10);
				}, 300);
			});

			it("get before put in memory", function(done){
				var gun = Gun();
				var check = {};
				var count = {};
				gun.get('g/n/m/f/l/n/r').map().on(function(v,f){
					//console.log("***********", f,v);
					check[f] = v;
					count[f] = (count[f] || 0) + 1;
					if(check.alice && check.bob && check.alice.PhD){
						clearTimeout(done.to);
						done.to = setTimeout(function() {
							expect(check.alice.age).to.be(24);
							expect(check.bob.age).to.be(26);
							expect(check.alice.PhD).to.be(true);
							//expect(count.alice).to.be(2);
							//expect(count.bob).to.be(1);
							if(done.c){return}
							done();done.c=1;
						},50);
					}
				});
				gun.put({_:{'#':'g/n/m/f/l/n/r'},
					alice: {_:{'#':'GALICE1'},
						name: "alice",
						age: 24,
						spouse: {
							name: "carl",
							age: 25,
							work: {
								name: "GUN INC"
							}
						},
						bout: {huh:1}
					},
					bob: {
						name: "bob",
						age: 26,
						spouse: {
							name: "diana",
							age: 27,
							work: {
								name: "ACME INC"
							}
						}
					}
				});
				setTimeout(function() {
					gun.get('GALICE1').put({PhD: true});
				},300);
			});

			it("in memory get after", function(done){
				var gun = Gun();
				gun.put({_:{'#':'g/n/m/f/l/n'},
						alice: {_:{'#':'GALICE2'},
							name: "alice",
							age: 24,
							spouse: {
								name: "carl",
								age: 25,
								work: {
									name: "GUN INC"
								}
							},
							bout: {huh:1}
						},
						bob: {
							name: "bob",
							age: 26,
							spouse: {
								name: "diana",
								age: 27,
								work: {
									name: "ACME INC"
								}
							}
						}
				});
				var check = {};
				//gun.get('g/n/m/f/l/n').get('bob.spouse.work').on(function(v,f){ console.log("!!!!!!!!!", f, v);});return;
				gun.get('g/n/m/f/l/n').map().on(function(v,f){
					check[f] = v;
					//console.log("*******************", f, v);
					if(check.alice && check.bob && check.alice.PhD){
						clearTimeout(done.to);
						done.to = setTimeout(function() {
							expect(check.alice.age).to.be(24);
							expect(check.bob.age).to.be(26);
							expect(check.alice.PhD).to.be(true);
							done();
						},10);
					}
				});
				setTimeout(function() {
					gun.get('GALICE2').put({PhD: true});
				},300);
			});

			it("in memory get before map get", function(done){
				var gun = Gun();
				var check = {};
				gun.get('g/n/m/f/l/n/b/p').map().get('name').on(function(v,f){
					check[v] = f;
					//console.log("****************", f,v, gun);
					if(check.alice && check.bob && check.Alice){
						clearTimeout(done.to);
						done.to = setTimeout(function() {
							expect(check.alice).to.be('name');
							expect(check.bob).to.be('name');
							expect(check.Alice).to.be('name');
							if(done.c){return}done.c=1;
							done();
						},10);
					}
				});
				gun.put({_:{'#':'g/n/m/f/l/n/b/p'},
						alice: {_:{'#':'GALICE3'},
							name: "alice",
							age: 24,
							spouse: {
								name: "carl",
								age: 25,
								work: {
									name: "GUN INC"
								}
							},
							bout: {huh:1}
						},
						bob: {
							name: "bob",
							age: 26,
							spouse: {
								name: "diana",
								age: 27,
								work: {
									name: "ACME INC"
								}
							}
						}
				});
				setTimeout(function() {
					//console.debug.i=1;console.log("-------------");
					gun.get('GALICE3').put({name: 'Alice'});
				},300);
			});

			it("in memory get after map get", function(done){
				var gun = Gun();
				gun.put({_:{'#':'g/n/m/f/l/n/m/p'},
						alice: {_:{'#':'GALICE4'},
							name: "alice",
							age: 24,
							spouse: {
								name: "carl",
								age: 25,
								work: {
									name: "GUN INC"
								}
							},
							bout: {huh:1}
						},
						bob: {
							name: "bob",
							age: 26,
							spouse: {
								name: "diana",
								age: 27,
								work: {
									name: "ACME INC"
								}
							}
						}
				});
				var check = {};
				gun.get('g/n/m/f/l/n/m/p').map().get('name').on(function(v,f){
					check[v] = f;
					//console.log("*****************", f,v);
					if(check.alice && check.bob && check.Alice){
						clearTimeout(done.to);
						done.to = setTimeout(function() {
							expect(check.alice).to.be('name');
							expect(check.bob).to.be('name');
							expect(check.Alice).to.be('name');
							done();
						},10);
					}
				});
				setTimeout(function() {
					gun.get('GALICE4').put({name: 'Alice'});
				},300);
			});

			it("in memory get before map get get", function(done){
				var gun = Gun();
				var check = {};
				gun.get('g/n/m/f/l/n/b/p/p/p').map().get('spouse').get('work').on(function(v,f){
					check[v.name] = f;
					//console.log("*******", f, v);
					if(check['GUN INC'] && check['ACME INC'] && check['ACME INC.']){
						clearTimeout(done.to);
						done.to = setTimeout(function() {
							expect(check['GUN INC']).to.be('work');
							expect(check['ACME INC']).to.be('work');
							expect(check['ACME INC.']).to.be('work');
							if(done.c){return}done.c=1;
							done();
						},10);
					}
				});
				gun.put({_:{'#':'g/n/m/f/l/n/b/p/p/p'},
						alice: {
							name: "alice",
							age: 24,
							spouse: {
								name: "carl",
								age: 25,
								work: {
									name: "GUN INC"
								}
							},
							bout: {huh:1}
						},
						bob: {
							name: "bob",
							age: 26,
							spouse: {
								name: "diana",
								age: 27,
								work: {_:{'#':'CCINEMA1'},
									name: "ACME INC"
								}
							}
						}
				});
				setTimeout(function() {
					//console.debug.i=1;console.log("----------------");
					gun.get('CCINEMA1').put({name: 'ACME INC.'});
				},300);
			});

			it("in memory get after map get get", function(done){
				var gun = Gun();
				gun.put({_:{'#':'g/n/m/f/l/n/b/p/p/p/a'},
						alice: {
							name: "alice",
							age: 24,
							spouse: {
								name: "carl",
								age: 25,
								work: {
									name: "GUN INC"
								}
							},
							bout: {huh:1}
						},
						bob: {
							name: "bob",
							age: 26,
							spouse: {
								name: "diana",
								age: 27,
								work: {_:{'#':'CCINEMA2'},
									name: "ACME INC"
								}
							}
						}
				});
				var check = {};
				gun.get('g/n/m/f/l/n/b/p/p/p/a').map().get('spouse').get('work').on(function(v,f){
					check[v.name] = f;
					if(check['GUN INC'] && check['ACME INC'] && check['ACME INC.']){
						clearTimeout(done.to);
						done.to = setTimeout(function() {
							expect(check['GUN INC']).to.be('work');
							expect(check['ACME INC']).to.be('work');
							expect(check['ACME INC.']).to.be('work');
							done();
						},10);
					}
				});
				setTimeout(function() {
					gun.get('CCINEMA2').put({name: 'ACME INC.'});
				},300);
			});

			it("in memory get before map map", function(done){
				var gun = Gun();
				var check = {};
				gun.get('g/n/m/f/l/n/b/a/m/m').map().map().on(function(v,f){
					check[f] = v;
					//console.log("****************", f,v);
					if(check.alice && check.bob && check.GUN && check.ACME && check.ACME.corp){
						clearTimeout(done.to);
						done.to = setTimeout(function() {
							expect(check.alice.name).to.be('alice');
							expect(check.alice.age).to.be(24);
							expect(Gun.val.link.is(check.alice.spouse)).to.be.ok();
							expect(check.bob.name).to.be('bob');
							expect(check.bob.age).to.be(26);
							expect(Gun.val.link.is(check.bob.spouse)).to.be.ok();
							expect(check.GUN.name).to.be('GUN');
							expect(check.ACME.name).to.be('ACME');
							expect(check.ACME.corp).to.be('C');
							if(done.c){return}done.c=1;
							done();
						},10);
					}
				});
				//console.debug.i=1;console.log("------------------------");
				gun.put({_:{'#':'g/n/m/f/l/n/b/a/m/m'},
						users: {
							alice: {
								name: "alice",
								age: 24,
								spouse: {
									name: "carl",
									age: 25
								},
								bout: {huh:1}
							},
							bob: {
								name: "bob",
								age: 26,
								spouse: {
									name: "diana",
									age: 27
								}
							}
						},
						companies: {
							GUN: {
								name: "GUN"
							},
							ACME: {_:{'#':"CCINEMA3"},
								name: "ACME"
							}
						}
				});
				setTimeout(function() {
					//console.debug.i=1;console.log("-------------");
					gun.get('CCINEMA3').put({corp: "C"});
				},300);
			});

			it("in memory get after map map", function(done){
				var gun = Gun();
				gun.put({_:{'#':'g/n/m/f/l/n/b/m/m'},
						users: {
							alice: {
								name: "alice",
								age: 24,
								spouse: {
									name: "carl",
									age: 25
								},
								bout: {huh:1}
							},
							bob: {
								name: "bob",
								age: 26,
								spouse: {
									name: "diana",
									age: 27
								}
							}
						},
						companies: {
							GUN: {
								name: "GUN"
							},
							ACME: {_:{'#':"CCINEMA4"},
								name: "ACME"
							}
						}
				});
				var check = {};
				gun.get('g/n/m/f/l/n/b/m/m').map().map().on(function(v,f){
					check[f] = v;
					//console.log("***************", f,v);
					if(check.alice && check.bob && check.GUN && check.ACME && check.ACME.corp){
						clearTimeout(done.to);
						done.to = setTimeout(function() {
							expect(check.alice.name).to.be('alice');
							expect(check.alice.age).to.be(24);
							expect(Gun.val.link.is(check.alice.spouse)).to.be.ok();
							expect(check.bob.name).to.be('bob');
							expect(check.bob.age).to.be(26);
							expect(Gun.val.link.is(check.bob.spouse)).to.be.ok();
							expect(check.GUN.name).to.be('GUN');
							expect(check.ACME.name).to.be('ACME');
							expect(check.ACME.corp).to.be('C');
							done();
						},10);
					}
				});
				setTimeout(function() {
					gun.get('CCINEMA4').put({corp: "C"});
				},300);
			});

			it("in memory get before map map get", function(done){
				var gun = Gun();
				var check = {};
				gun.get('g/n/m/f/l/n/b/m/m/p').map().map().get('name').on(function(v,f){
					check[v] = f;
					//console.log("***********", f,v);
					if(check.alice && check.bob && check.GUN && check.ACME && check.ACMEINC){
						clearTimeout(done.to);
						done.to = setTimeout(function() {
							expect(check.alice).to.be('name');
							expect(check.bob).to.be('name');
							expect(check.GUN).to.be('name');
							expect(check.ACME).to.be('name');
							expect(check.ACMEINC).to.be('name');
							if(done.c){return}done.c=1;
							done();
						},10);
					}
				});
				gun.put({_:{'#':'g/n/m/f/l/n/b/m/m/p'},
						users: {
							alice: {
								name: "alice",
								age: 24,
								spouse: {
									name: "carl",
									age: 25
								},
								bout: {huh:1}
							},
							bob: {
								name: "bob",
								age: 26,
								spouse: {
									name: "diana",
									age: 27
								}
							}
						},
						companies: {
							GUN: {
								name: "GUN"
							},
							ACME: {_:{'#':"CCINEMA5"},
								name: "ACME"
							}
						}
				});
				setTimeout(function() {
					gun.get('CCINEMA5').put({name: "ACMEINC"});
				},300);
			});

			it("in memory get after map map get", function(done){
				var gun = Gun();
				var check = {};
				gun.put({_:{'#':'g/n/m/f/l/n/b/a/m/m/p'},
						users: {
							alice: {
								name: "alice",
								age: 24,
								spouse: {
									name: "carl",
									age: 25
								},
								bout: {huh:1}
							},
							bob: {
								name: "bob",
								age: 26,
								spouse: {
									name: "diana",
									age: 27
								}
							}
						},
						companies: {
							GUN: {
								name: "GUN"
							},
							ACME: {_:{'#':'CCINEMA6'},
								name: "ACME"
							}
						}
				});
				gun.get('g/n/m/f/l/n/b/a/m/m/p').map().map().get('name').on(function(v,f){
					check[v] = f;
					//console.log("************", f,v);
					if(check.alice && check.bob && check.GUN && check.ACME && check.ACMEINC){
						clearTimeout(done.to);
						done.to = setTimeout(function() {
							expect(check.alice).to.be('name');
							expect(check.bob).to.be('name');
							expect(check.GUN).to.be('name');
							expect(check.ACME).to.be('name');
							expect(check.ACMEINC).to.be('name');
							done();
						},10);
					}
				});
				setTimeout(function() {
					gun.get('CCINEMA6').put({name: "ACMEINC"});
				},300);
			});

			it("in memory get before map map get get", function(done){
				var gun = Gun();
				var check = {};
				gun.get('g/n/m/f/l/n/b/m/m/p/p').map().map().get('address').get('state').on(function(v,f){
					check[v] = f;
					if(check.QR && check.NY && check.CA && check.TX && check.MA){
						clearTimeout(done.to);
							done.to = setTimeout(function() {
							expect(check.QR).to.be('state');
							expect(check.NY).to.be('state');
							expect(check.CA).to.be('state');
							expect(check.TX).to.be('state');
							expect(check.MA).to.be('state');
							if(done.c){return}done.c=1;
							done();
						},10);
					}
				});
				gun.put({_:{'#':'g/n/m/f/l/n/b/m/m/p/p'},
						users: {
							alice: {
								name: "alice",
								age: 24,
								address: {_:{'#':'QUANGO'},
									state: "MA"
								},
								spouse: {
									name: "carl",
									age: 25
								},
								bout: {huh:1}
							},
							bob: {
								name: "bob",
								age: 26,
								address: {
									state: "TX"
								},
								spouse: {
									name: "diana",
									age: 27
								}
							}
						},
						companies: {
							GUN: {
								name: "GUN",
								address: {
									state: "CA"
								}
							},
							ACME: {
								name: "ACME",
								address: {
									state: "NY"
								}
							}
						}
				});
				setTimeout(function() {
					gun.get('QUANGO').put({state: 'QR'});
				},300);
			});

			it("in memory get after map map get get", function(done){
				var gun = Gun();
				gun.put({_:{'#':'g/n/m/f/l/n/b/a/m/m/p/p'},
						users: {
							alice: {
								name: "alice",
								age: 24,
								address: {_:{'#':'QUANGO1'},
									state: "MA"
								},
								spouse: {
									name: "carl",
									age: 25
								},
								bout: {huh:1}
							},
							bob: {
								name: "bob",
								age: 26,
								address: {
									state: "TX"
								},
								spouse: {
									name: "diana",
									age: 27
								}
							}
						},
						companies: {
							GUN: {
								name: "GUN",
								address: {
									state: "CA"
								}
							},
							ACME: {
								name: "ACME",
								address: {
									state: "NY"
								}
							}
						}
				});
				var check = {};
				gun.get('g/n/m/f/l/n/b/a/m/m/p/p').map().map().get('address').get('state').on(function(v,f){
					check[v] = f;
					if(check.QR && check.NY && check.CA && check.TX && check.MA){
						clearTimeout(done.to);
						done.to = setTimeout(function() {
							expect(check.QR).to.be('state');
							expect(check.NY).to.be('state');
							expect(check.CA).to.be('state');
							expect(check.TX).to.be('state');
							expect(check.MA).to.be('state');
							done();
						},10);
					}
				});
				setTimeout(function() {
					gun.get('QUANGO1').put({state: 'QR'});
				},300);
			});

			it("in memory get before map map get get get", function(done){
				var gun = Gun();
				var check = {};
				gun.get('g/n/m/f/l/n/b/m/m/p/p/p').map().map().get('address').get('state')
					.get('code')
					.on(function(v,f){
					check[v] = f;
					if(check.QR && check.NY && check.CA && check.TX && check.MA){
						clearTimeout(done.to);
						done.to = setTimeout(function() {
							expect(check.QR).to.be('code');
							expect(check.NY).to.be('code');
							expect(check.CA).to.be('code');
							expect(check.TX).to.be('code');
							expect(check.MA).to.be('code');
							if(done.c){return}done.c=1;
							done();
						},10);
					}
				});
				gun.put({_:{'#':'g/n/m/f/l/n/b/m/m/p/p/p'},
						users: {
							alice: {
								name: "alice",
								age: 24,
								address: {
									state: {_:{'#':'HIPPOM'},
										code: "MA",
										county: {
											MA1: "First"
										}
									}
								},
								spouse: {
									name: "carl",
									age: 25
								},
								bout: {huh:1}
							},
							bob: {
								name: "bob",
								age: 26,
								address: {
									state: {
										code: "TX",
										county: {
											TX1: "First"
										}
									}
								},
								spouse: {
									name: "diana",
									age: 27
								}
							}
						},
						companies: {
							GUN: {
								name: "GUN",
								address: {
									state: {
										code: "CA",
										county: {
											CA1: "First"
										}
									}
								}
							},
							ACME: {
								name: "ACME",
								address: {
									state: {
										code: "NY",
										county: {
											NY1: "First"
										}
									}
								}
							}
						}
				});
				setTimeout(function() {
					gun.get('HIPPOM').put({code: 'QR'});
				},300);
			});

			it("in memory get before after map map get get get", function(done){
				var gun = Gun();
				var check = {};
				gun.put({_:{'#':'g/n/m/f/l/n/b/a/m/m/p/p/p'},
						users: {
							alice: {
								name: "alice",
								age: 24,
								address: {
									state: {_:{'#':'HIPPOM1'},
										code: "MA",
										county: {
											MA1: "First"
										}
									}
								},
								spouse: {
									name: "carl",
									age: 25
								},
								bout: {huh:1}
							},
							bob: {
								name: "bob",
								age: 26,
								address: {
									state: {
										code: "TX",
										county: {
											TX1: "First"
										}
									}
								},
								spouse: {
									name: "diana",
									age: 27
								}
							}
						},
						companies: {
							GUN: {
								name: "GUN",
								address: {
									state: {
										code: "CA",
										county: {
											CA1: "First"
										}
									}
								}
							},
							ACME: {
								name: "ACME",
								address: {
									state: {
										code: "NY",
										county: {
											NY1: "First"
										}
									}
								}
							}
						}
				});
				gun.get('g/n/m/f/l/n/b/a/m/m/p/p/p').map().map().get('address').get('state')
					.get('code')
					.on(function(v,f){
					check[v] = f;
					//console.log("***********", f,v);
					if(check.QR && check.NY && check.CA && check.TX && check.MA){
						clearTimeout(done.to);
						done.to = setTimeout(function() {
							expect(check.QR).to.be('code');
							expect(check.NY).to.be('code');
							expect(check.CA).to.be('code');
							expect(check.TX).to.be('code');
							expect(check.MA).to.be('code');
							done();
						},10);
					}
				});
				setTimeout(function() {
					gun.get('HIPPOM1').put({code: 'QR'});
				},300);
			});

			it("in memory get before map map get get node", function(done){
				var gun = Gun();
				var check = {};
				gun.get('g/n/m/f/l/n/b/m/m/p/p/n').map().map().get('address').get('state').on(function(v,f){
					check[v.code] = f;
					//console.log("************", f, v);
					if(check.QR && check.NY && check.CA && check.TX && check.MA){
						clearTimeout(done.to);
						done.to = setTimeout(function() {
							expect(check.QR).to.be('state');
							expect(check.NY).to.be('state');
							expect(check.CA).to.be('state');
							expect(check.TX).to.be('state');
							expect(check.MA).to.be('state');
							if(done.c){return}done.c=1;
							done();
						},10);
					}
				});
				gun.put({_:{'#':'g/n/m/f/l/n/b/m/m/p/p/n'},
						users: {
							alice: {
								name: "alice",
								age: 24,
								address: {
									state: {_:{'#':'HIPPOM3'},
										code: "MA",
										county: {
											MA1: "First"
										}
									}
								},
								spouse: {
									name: "carl",
									age: 25
								},
								bout: {huh:1}
							},
							bob: {
								name: "bob",
								age: 26,
								address: {
									state: {
										code: "TX",
										county: {
											TX1: "First"
										}
									}
								},
								spouse: {
									name: "diana",
									age: 27
								}
							}
						},
						companies: {
							GUN: {
								name: "GUN",
								address: {
									state: {
										code: "CA",
										county: {
											CA1: "First"
										}
									}
								}
							},
							ACME: {
								name: "ACME",
								address: {
									state: {
										code: "NY",
										county: {
											NY1: "First"
										}
									}
								}
							}
						}
				});
				setTimeout(function() {
					gun.get('HIPPOM3').put({code: 'QR'});
				},300);
			});

			it("in memory get before after map map get get node", function(done){
				var gun = Gun();
				var check = {};
				gun.put({_:{'#':'g/n/m/f/l/n/b/a/m/m/p/p/n'},
						users: {
							alice: {
								name: "alice",
								age: 24,
								address: {
									state: {_:{'#':'HIPPOM4'},
										code: "MA",
										county: {
											MA1: "First"
										}
									}
								},
								spouse: {
									name: "carl",
									age: 25
								},
								bout: {huh:1}
							},
							bob: {
								name: "bob",
								age: 26,
								address: {
									state: {
										code: "TX",
										county: {
											TX1: "First"
										}
									}
								},
								spouse: {
									name: "diana",
									age: 27
								}
							}
						},
						companies: {
							GUN: {
								name: "GUN",
								address: {
									state: {
										code: "CA",
										county: {
											CA1: "First"
										}
									}
								}
							},
							ACME: {
								name: "ACME",
								address: {
									state: {
										code: "NY",
										county: {
											NY1: "First"
										}
									}
								}
							}
						}
				});
				gun.get('g/n/m/f/l/n/b/a/m/m/p/p/n').map().map().get('address').get('state').on(function(v,f){
					check[v.code] = f;
					//console.log("**********", f, v);
					if(check.QR && check.NY && check.CA && check.TX && check.MA){
						clearTimeout(done.to);
						done.to = setTimeout(function() {
							expect(check.QR).to.be('state');
							expect(check.NY).to.be('state');
							expect(check.CA).to.be('state');
							expect(check.TX).to.be('state');
							expect(check.MA).to.be('state');
							done();
						},10);
					}
				});
				setTimeout(function() {
					gun.get('HIPPOM4').put({code: 'QR'});
				},300);
			});

			it("in memory get after map map get get get map", function(done){
				var gun = Gun();
				var check = {};
				gun.put({_:{'#':'g/n/m/f/l/n/b/a/m/m/p/p/p/n'},
						users: {
							alice: {
								name: "alice",
								age: 24,
								address: {
									state: {
										code: "MA",
										county: {
											MA1: "First"
											,MA2: "Second"
										}
									}
								},
								spouse: {
									name: "carl",
									age: 25
								},
								bout: {huh:1}
							},
							bob: {
								name: "bob",
								age: 26,
								address: {
									state: {
										code: "TX",
										county: {
											TX1: "First"
											,TX2: "Second"
										}
									}
								},
								spouse: {
									name: "diana",
									age: 27
								}
							}
						},
						companies: {
							GUN: {
								name: "GUN",
								address: {
									state: {
										code: "CA",
										county: {
											CA1: "First"
											,CA2: "Second"
										}
									}
								}
							},
							ACME: {
								name: "ACME",
								address: {
									state: {
										code: "NY",
										county: {_:{'#':'NYCOUNT'},
											NY1: "First"
											,NY2: "Second"
										}
									}
								}
							}
						}
				});
				gun.get('g/n/m/f/l/n/b/a/m/m/p/p/p/n').map().map().get('address').get('state').get('county').map().on(function(v,f){
					check[f] = v;
					//console.log("****************", f,v);
					if(check.MA1 && check.MA2 && check.TX1 && check.TX2 && check.CA1 && check.CA2 && check.NY1 && check.NY2 && check.NY3){
						clearTimeout(done.to);
							done.to = setTimeout(function() {
							expect(check.MA1).to.be('First');
							expect(check.TX1).to.be('First');
							expect(check.CA1).to.be('First');
							expect(check.NY1).to.be('First');
							expect(check.MA2).to.be('Second');
							expect(check.TX2).to.be('Second');
							expect(check.CA2).to.be('Second');
							expect(check.NY2).to.be('Second');
							expect(check.NY3).to.be('Third');
							done();
						},10);
					}
				});
				setTimeout(function() {
					gun.get('NYCOUNT').put({NY3: "Third"});
				},300);
			});
		});

		it('get node after recursive field', function(done){
			var s = Gun.state.map();s.soul = 'node/circle';
			var bob = {age: 29, name: "Bob!"};
			var cat = {name: "Fluffy", species: "kitty"};
			var user = {bob: bob};
			bob.pet = cat;
			cat.slave = bob;
			gun.on('put', {$: gun, put: Gun.graph.ify(user, s)});
			//console.debug.i=1;console.log("-------------");
			gun.get(s.soul).get('bob').get('pet').get('slave').once(function(data){
				//clearTimeout(done.to);
				//setTimeout(function() {
					//console.log("*****************", data);return;
					expect(data.age).to.be(29);
					expect(data.name).to.be("Bob!");
					expect(Gun.val.link.is(data.pet)).to.ok();
					done();
				//},300);
			});
		});

		it('recursive put', function(done){
			//localStorage.clear();
			var gun = Gun();

			var parent = gun.get('parent');
			var child = gun.get('child');

			child.put({
				way: 'down'
			});

			parent.get('sub').put(child);

			parent.get('sub').on(function(data){
				//console.log("sub", data);
				done.sub = data;
			});
			child.on(function(data){
				done.child = data;
				//console.log("child", data);
			});
			parent.on(function(data){
				done.parent = data;
				//console.log("parent", data);
				if(done.c){ return } done.c = 1;
				done(); // TODO: Add more meaningful checks!
			});
		});

		it('empty val followed', function(done){
			var gun = Gun();

			gun.get('val/follow').once(function(data){
				//console.log("val", data);
			}).get(function(at){
				//console.log("?????", at);
				if(done.c){ return } done.c = 1;
				done();
			});

		});

		it('map val get put', function(done){
			var gun = Gun().get('chat/asdf');

			var check = {}, count = {};
			gun.map().once(function(v,f){
				check[f] = v;
				count[f] = (count[f] || 0) + 1;
				//console.log("**************", f, v);
				if(check['1-1'] && check['2-2']){
					clearTimeout(done.to);
					done.to = setTimeout(function() {
						expect(check['1-1'].what).to.be('hi');
						expect(check['2-2'].what).to.be('you.');
						expect(count['1-1']).to.be(1);
						expect(count['2-2']).to.be(1);
						done();
					},50);
				}
			});
			setTimeout(function() {
				gun.get('1-1').put({what: "hi"});
				setTimeout(function() {
					gun.get('2-2').put({what: "you."});
				},40);
			},40);
		});

		it('get list set map val', function(done){

			var gun = Gun();

			var list = gun.get('list');

			list.set(gun.get('alice').put({name: "Alice", group: "awesome", married: true}));
			list.set(gun.get('bob').put({name: "Bob", group: "cool", married: true}));
			list.set(gun.get('carl').put({name: "Carl", group: "cool", married: false}));
			list.set(gun.get('dave').put({name: "Dave", group: "awesome", married: true}));

			var check = {}, count = {};
			list.map().once(function(data, id){
				//console.log("***************", id, data);
				check[id] = data;
				count[id] = (count[id] || 0) + 1;
				if(check.alice && check.bob && check.carl && check.dave){
					clearTimeout(done.to);
					done.to = setTimeout(function() {
						expect(count.alice).to.be(1);
						expect(check.alice.name).to.be('Alice');
						expect(check.alice.group).to.be('awesome');
						expect(check.alice.married).to.be(true);
						expect(count.bob).to.be(1);
						expect(check.bob.name).to.be('Bob');
						expect(check.bob.group).to.be('cool');
						expect(check.bob.married).to.be(true);
						expect(count.carl).to.be(1);
						expect(check.carl.name).to.be('Carl');
						expect(check.carl.group).to.be('cool');
						expect(check.carl.married).to.be(false);
						expect(count.dave).to.be(1);
						expect(check.dave.name).to.be('Dave');
						expect(check.dave.group).to.be('awesome');
						expect(check.dave.married).to.be(true);
						done();
					},50);
				}
			});
			/*
				Have we asked for this yet? No.
				Do we have it cached? No.
				Is its parent cached? Yes.
				Reply immediately with that cache for map to process.
			*/

			/*
				chain has a root // all
				an ID // all
				a back // all
				inputs // all
				and outputs // all
				acks // any
				echo // any
				next // any
				cache or map of many ones // only a one can have a cache, only a map can have many, and they must be ones. However any chain might have neither. By default a chain is a many, unless it is designated as a one.

				gun.get('alice').also('bob').path('name').on(cb);
				gun.get('users').map().path('friends').map().on(cb);

				friends is a map, it has an echo
				{name: "alice", friends: []}
					{name: "xavier"}
					{name: "yara"}
					{name: "zack"}
				{name: "bob", friends: []}
					{name: "xavier"}
					{name: "yara"}
					{name: "zack"}
				{name: "carl", friends: []}
					{name: "xavier"}
					{name: "yara"}
					{name: "zack"}
			*/
		});

		it('get get get set root get put', function(done){
			var gun = Gun().get('app');
			//console.debug.i=1;console.log('---------------');
			gun.get('alias').get('mark').set(
				gun.back(-1).get('pub').put({
					alias: 'mark',
					auth: 'encrypt', // oops
					born: 1,
					pub: 'pub',
					salt: 'random'
				})
			);
			//return;
			setTimeout(function() {
				//console.debug.i=1;console.log('---------------');
				gun.get(function(at){
					//console.log("*", at.put);//return;
					done.app = done.app || at.put.alias;
				});
				gun.back(-1).get('pub').get(function(at){
					//console.log("**", at.put);
					done.pub = done.pub || at.put.auth;
				});
				gun.get('alias').get(function(at){
					//console.log("***", at.put);
					done.alias = done.alias || at.put.mark;
					//!console.debug.i&&(console.debug.i=1)&&console.log("---------------------");
				}).get('mark').on(function(data){
					//console.log("************", data);//return;
					clearTimeout(done.to);
					done.to = setTimeout(function() {
						done.mark = done.mark || data.pub;
						expect(Gun.val.link.is(done.mark)).to.be('pub');
						expect(done.app).to.be.ok();
						expect(done.pub).to.be.ok();
						expect(done.alias).to.be.ok();
						if(done.c){ return } done.c = 1;
						done();
					},100);
				})
			},100);
		});

		it('get put get get put reload get get then get', function(done){
			this.timeout(9000);
			var gun = Gun();

			gun.get('stef').put({name:'Stef'});
			var address = {
			  country: 'Netherlands',
			  zip:'999999'
			};
			gun.get('stef').get('address').put(address);

			// reload
			setTimeout(function() {
				var gun2 = Gun();
				//console.log(require('fs').readFileSync('./radata/!').toString());
				gun2.get('stef').get('address').once(function(data){ // Object {_: Object, country: "Netherlands", zip: "1766KP"} "adress"
					//console.log("******", data);
					done.a = true;
					expect(data.country).to.be('Netherlands');
					expect(data.zip).to.be('999999');
					if(!done.s){ return }
					if(done.c){ return } done.c = 1;
					done();
				});
				gun2.get('stef').once(function(data){ //Object {_: Object, address: Object} "stef"
					//console.log("**************", data);
					//return;
					done.s = true;
					expect(data.name).to.be('Stef');
					expect(data.address).to.be.ok();
					if(!done.a){ return }
					if(done.c){ return } done.c = 1;
					done();
				});
			},1200);
		});

		it('get get get any parallel', function(done){
			var s = Gun.state.map();s.soul = 'parallel';
			gun.on('put', {$: gun, put: Gun.graph.ify({
				bob: {
					age: 29,
					name: "Bob!"
				}
			}, s)});
			gun.get('parallel').get('bob').get('age').get(function(at, ev){
				var err = at.err, data = at.put, field = at.get;
				//console.log("***** age", data, at.$._.ack);//return;
				expect(data).to.be(29);
				expect(field).to.be('age');
				done.age = true;
			});
			gun.get('parallel').get('bob').get('name').get(function(at, ev){
				var err = at.err, data = at.put, field = at.get;
				//console.log("*********** name", data, at.$._.ack);//return;
				expect(data).to.be('Bob!');
				expect(field).to.be('name');
				done.name = true;
				expect(done.age).to.be.ok();
				if(done.c){ return } done.c = 1;
				done();
			});
		});

		it('get get get any later', function(done){
			var s = Gun.state.map();s.soul = 'parallel/later';
			gun.on('put', {$: gun, put: Gun.graph.ify({
				bob: {_:{'#':'ddfsa'},
					age: 29,
					name: "Bob!"
				}
			}, s)});
			gun.get('parallel/later').get('bob').get('age').get(function(at, ev){
				var err = at.err, data = at.put, field = at.get;
				//console.log("***** age", data);
				expect(data).to.be(29);
				expect(field).to.be('age');
				done.age = true;
			});
			setTimeout(function() {
				gun.get('parallel/later').get('bob').get('name').get(function(at, ev){
					var err = at.err, data = at.put, field = at.get;
					//console.log("*********** name", data);
					expect(data).to.be('Bob!');
					expect(field).to.be('name');
					done.name = true;
					expect(done.age).to.be.ok();
					if(done.c){ return } done.c = 1;
					done();
				});
			},400);
		});

		it('get get get any not', function(done){
			gun.get('parallel/not').get('bob').get('age').get(function(at, ev){
				var err = at.err, data = at.put, field = at.get;
				//console.log("***** age", data);
				expect(data).to.be(undefined);
				expect(field).to.be('age');
				done.age = true;
			});
			gun.get('parallel/not').get('bob').get('name').get(function(at, ev){
				var err = at.err, data = at.put, field = at.get;
				//console.log("*********** name", data);
				expect(data).to.be(undefined);
				expect(field).to.be('name');
				done.name = true;
				expect(done.age).to.be.ok();
				if(done.c){return}done.c=1;
				done();
			});
		});

		it('get get get any not later', function(done){
			gun.get('parallel/not/later').get('bob').get('age').get(function(at, ev){
				var err = at.err, data = at.put, field = at.get;
				//console.log("***** age", data);
				expect(data).to.be(undefined);
				expect(field).to.be('age');
				done.age = true;
			});
			setTimeout(function() {
				//console.debug.i=1;console.log('---------------');
				gun.get('parallel/not/later').get('bob').get('name').get(function(at, ev){
					var err = at.err, data = at.put, field = at.get;
					//console.log("*********** name", field, data);
					expect(data).to.be(undefined);
					expect(field).to.be('name');
					done.name = true;
					expect(done.age).to.be.ok();
					if(done.c){ return } done.c = 1;
					done();
				});
			},400);
		});

		it('get any any', function(done){
			var s = Gun.state.map();s.soul = 'full';
			gun.on('put', {$: gun, put: Gun.graph.ify({
				hello: 'world',
				goodbye: 'mars'
			}, s)});
			gun.get('full').get(function(at, ev){
				var err = at.err, data = at.$._.put || at.put, field = at.get;
				//console.log("*****1", data);
				expect(data.hello).to.be('world');
				expect(data.goodbye).to.be('mars');
			});
			gun.get('full').get(function(at, ev){
				var err = at.err, data = at.$._.put || at.put, field = at.get;
				//console.log("*****1", data);
				expect(data.hello).to.be('world');
				expect(data.goodbye).to.be('mars');
				if(done.c){ return } done.c = 1;
				done();
			});
		});

		it('get any any later', function(done){
			var s = Gun.state.map();s.soul = 'full/later';
			gun.on('put', {$: gun, put: Gun.graph.ify({
				hello: 'world',
				goodbye: 'mars'
			}, s)});
			gun.get('full/later').get(function(at, ev){
				var err = at.err, data = at.$._.put || at.put, field = at.get;
				//console.log("*****", data);
				expect(data.hello).to.be('world');
				expect(data.goodbye).to.be('mars');
			});
			setTimeout(function() {
				gun.get('full/later').get(function(at, ev){
					var err = at.err, data = at.$._.put || at.put, field = at.get;
					//console.log("*****2", field, data);
					expect(data.hello).to.be('world');
					expect(data.goodbye).to.be('mars');
					if(done.c){ return } done.c = 1;
					done();
				});
			},400);
		});

		it('multiple times map', function(done){
			var gun = Gun();

			gun.get('usersMM').put({
				'mark': {
					fdsa: {
						pub: 'fdsa',
						name: "mark"
					}
				},
				'amber': {
					asdf: {
						pub: 'asdf',
						name: "amber"
					}
				}
			});

			var check = {A: {}, B: {}};
			setTimeout(function() {
				gun.get('usersMM').map().map().once(function(data){
					//console.log('A', data);
					check.A[data.pub] = true;
				})
			}, 900);

			setTimeout(function() {
				gun.get('usersMM').map().map().once(function(data){
					//console.log('B', data, check);
					check.B[data.pub] = true;
					if(check.A['asdf'] && check.A['fdsa'] && check.B['asdf'] && check.B['fdsa']){
						if(done.c){ return } done.c = 1;
						done();
					}
				})
			}, 1200);

		});

		it('multiple times', function(done){
			var gun = Gun();
			var app = gun.get('mult/times');

			app.get('alias').get('mark').set(gun.get('ASDF').put({
				pub: 'ASDF',
				alias: 'mark',
				born: 1
			}));

			app.get('alias').map().map().get('pub').on(function(data){
				done.one = data;
				//console.log("pub 1!", data);
			});

			setTimeout(function() {
				app.get('alias').map().map().get('alias').on(function(data){
					done.two = data;
					//console.log("alias 2!", data);
					expect(done.one).to.be("ASDF");
					expect(done.two).to.be("mark");
					if(done.c){ return } done.c = 1;
					done();
				});
			},100);
		});

		it('multiple times partial', function(done){
			var gun = Gun();

			var s = Gun.state.map();s.soul = 'mult/times/part';
			gun.on('put', {$: gun, put: Gun.graph.ify({
				alias: {
					mark: {
						pub: {_:{'#':'PUB'},
							pub: 'asdf',
							alias: 'mark',
							born: 1
						}
					}
				}
			}, s)});

			var app = gun.get(s.soul);

			//console.debug.i=1;console.log("===================");
			app.get('alias').get('mark').map().once(function(alias){
				//console.log("***", alias);
				done.alias = alias;
			});

			setTimeout(function() {
				app.get('alias').map().map().get('born').on(function(data){
					//console.log("*******", data);
					expect(data).to.be(1);
					expect(done.alias.pub).to.be("asdf");
					expect(done.alias.alias).to.be("mark");
					expect(done.alias.born).to.be(1);
					if(done.c){ return } done.c = 1;
					done();
				});
			},400);
		});

		it('put on a put', function(done){
			try{
			var gun = Gun();
			var foo = gun.get('put/on/put').get('a').get('b');
			var bar = gun.get('put/on/put/ok').get('a').get('b');

			bar.put({a:1});
			//console.log("vvvvvvvvv");
			bar.on(function(data){
				//console.log("***", data);
				if(1 === data.a && 3 === data.c){
					if(done.c){ return } done.c = 1;
					//console.log("-------");
					done();
				}
			});

			foo.on(function(ack){
				//console.log("*", ack);
				bar.put({c:3});
			});
			foo.put({b:2});
			}catch(e){ console.log("!!!!!!!!!!!", e)}
		});

		it('map with map function', function(done){
			var gun = Gun(), s = 'map/mapfunc', u;
			var app = gun.get(s);
			var list = app.get('list');

			var check = {};
			list.map(function(user){ /*console.log("****", user);*/ return user.age === 27? user.name + "thezombie" : u }).on(function(data){
				//console.log('+++++', data);
				check[data] = true;
				if(check.alicethezombie && check.bobthezombie){
					if(done.c){return}done.c=1;
					done();
				}
			});
			//console.debug.i=1;console.log("--------------");
			list.set({name: 'alice', age: 27}); // on put, table-scan flag doesn't get set, but is needed for initial!??
			list.set({name: 'bob', age: 27});
			list.set({name: 'carl', age: 29});
			list.set({name: 'dave', age: 25});
		});

		it('once map function once', function(done){
			var gun = Gun(), s = 'o/mf/o', u;
			var app = gun.get(s);
			var list = app.get('list');

			var check = {};
			gun.get('user').get('alice').put({name:'Alice', email:'alice@example.com'})
			gun.get('user').get('bob').put({name:'Bob', email:'bob@example.com'})
			gun.get('user').get('carl').put({name:'Carl', email:'carl@example.com'})

			gun.get('user').once().map(v => {
			  //console.log('this gets called', v);
			  return v
			}).once((v, k) => {
			  //console.log('this is never called', k, v);
			  check[k] = (check[k] || 0) + 1;
			  if(1 === check.alice && 1 === check.bob && 1 === check.carl){
			  	if(done.c){return}done.c=1;
			  	done();
			  }
			});

		});

		it('val and then map', function(done){
			var gun = Gun(), s = 'val/then/map', u;
			var list = gun.get(s);

			list.set(gun.get('alice').put({name: 'alice', age: 27}));
			list.set(gun.get('bob').put({name: 'bob', age: 27}));
			list.set(gun.get('carl').put({name: 'carl', age: 29}));
			list.set(gun.get('dave').put({name: 'dave', age: 25}));

			var check = {};
			list.once().map().on(function(data, key){
				check[key] = data;
				clearTimeout(done.to);
				//console.log("*****", key, data);
				done.to = setTimeout(function() {
					if(check.alice && check.bob && check.carl && check.dave && done.last){
						expect(check.alice.age).to.be(27);
						expect(check.bob.age).to.be(28);
						expect(check.carl.age).to.be(29);
						expect(check.dave.age).to.be(25);
						expect(check.eve).to.not.be.ok();
						if(done.c){return}done.c=1;
						done();
					}
				},600);
			});
			setTimeout(function() {
				list.set(gun.get('eve').put({name: 'eve', age: 30}));
				gun.get('bob').get('age').put(28);
				done.last = true;
			},300);
		});

		it('check null on map', function(done){
			var list = gun.get('myList');
			list.map(function(value, id){
				if("hello world" === value){
					done.one = true;
				}
				if(null === value){
					done.two = true;
				}
				if(done.one && done.two){
					if(done.c){ return } done.c = 1;
					done();
				}
			});
			list.get('message').put('hello world'); // outputs "message: hello world"
			list.get('message').put(null); // throws Uncaught TypeError: Cannot read property '#' of null
		});

		it('Check multi instance message passing', function(done){
			try{ require('fs').unlinkSync('bdata') }catch(e){}
			try{ require('fs').unlinkSync('ddata') }catch(e){}
			Gun.on('opt', function(ctx){
				ctx.on('out', function(msg){
					this.to.next(msg);
					var onGun = ctx;
					if(onGun.$ === b) {
						if(d){
							//console.log("b can send to d....", Gun.obj.copy(msg));
							d.on("in", msg);
						}
					} else if(onGun.$ === d){
						//console.log("d sends to b....", Gun.obj.copy(msg));
						b.on("in", msg);
					}
				});
			});

			var b = Gun({file: "bdata"});
			var d = null;

			var bb = b.get("key");
			bb.put({msg: "hello"});

			d = Gun({file: "ddata"});
			var db = d.get("key");
			db.map().on(function(val,field){
				expect(val).to.be('hello');
				if(done.c){ return } done.c = 1;
				setTimeout(function() {
					done();
				},1700);
			});
		});

		it('val should now get called if no data is found', function(done){
			var gun = Gun();

			gun.get('nv/foo').get('bar').get('baz').once(function(val, key){
				//console.log('*******', key, val);
				expect(val).to.be(undefined);
				done.fbb = true;
			});

			gun.get('nv/totesnothing').once(function(val, key){
				//console.log('***********', key, val);
				expect(val).to.be(undefined);
				done.t = true;
			});

			gun.get('nv/bz').get('lul').once(function(val, key){
				//console.log('*****************', key, val);
				expect(val).to.be(undefined);
				done.bzl = true;
				setTimeout(function() {
					if(done.fbb && done.t && done.bzl){
						if(done.c){ return } done.c = 1;
						done();
					}
				},100);
			});
		});

		it('Callbacks should have database safe data copies', function(done){
			var gun = Gun();

			gun.get('ds/safe').put({a: 1});

			gun.get('ds/safe').on(function(data){
				data.b = 2;
			});

			gun.get('ds/safe').once(function(data){
				expect(gun.back(-1)._.graph['ds/safe'].b).to.not.be.ok();
				if(done.c){ return } done.c = 1;
				done();
			});
		});

		it('If chain cannot be called, ack', function(done){
			var gun = Gun(), u;

			gun.on('put', {$: gun, put: Gun.graph.ify({
				wat: 1,
				a: true
			}, 'nl/app')});

			var app = gun.get('nl/app');

			app.get(function(d){
				expect(d.put.wat).to.be(1);
				expect(d.put.a).to.be(true);
				done.a = 1;
			});

			app.get('a').get('b').get(function(d){
				expect(d.put).to.be(u);
				expect(done.a).to.be.ok();
				if(done.c){ return }
				done(); done.c = 1;
			});
		});

		it('Chain on known nested object should ack', function(done){
			var gun = Gun(), u;

			gun.on('put', {$: gun, put: Gun.graph.ify({
				bar: {
					wat: 1
				}
			}, 'nl/app')});

			var app = gun.get('nl/app').get('bar');

			app.get(function(d){
				//console.log("!!", d.put);
				if(!d || !d.put || !d.put.wat){ return }
				expect(d.put.wat).to.be(1);
				done.a = 1;
				if(!done.u){ return }
				expect(done.u).to.be.ok();
				if(done.c){ return } done.c = 1;
				done();
			});

			app.get('a').get('b').get(function(d){
				//console.log("????", d.put);
				expect(d.put).to.be(u);
				done.u = true;
				if(!done.a){ return }
				expect(done.a).to.be.ok();
				if(done.c){ return } done.c = 1;
				done();
			});
		});

		it('Soul above but not beneath', function(done){
			this.timeout(5000);
			var gun = Gun();

			var a = gun.get('sabnb');

			a.get('profile').put({_:{'#': 'sabnbprofile'}, name: "Plum"});

			setTimeout(function() {
				a.get('profile').get('said').get('asdf').put('yes');
				setTimeout(function() {
					a.once(function(data){
						expect(data.profile).to.be.eql({'#': 'sabnbprofile'});
						if(done.c){ return } done.c = 1;
						done();
					})
				}, 100);
			}, 100);

		});

		it('users map map who said map on', function(done){
			this.timeout(1000 * 9);
			var gun = Gun();

			gun.get('users/mm').put({
				alice: {_:{'#':'alias/alice'},
					'pub/asdf': {_:{'#':'pub/asdf'},
						pub: 'asdf'
					}
				},
				bob: {_:{'#':'alias/bob'},
					'pub/fdsa': {_:{'#':'pub/fdsa'},
						pub: 'fdsa'
					}
				}
			});

			var check = {}, c = 0, end;
			//console.log(check);
			gun.get('users/mm').map().map()
				.get('who').get('said').map().on(function(msg){
					//console.log("------>", msg.num);
					if(check[msg.num]){
						//console.log("!!!!", msg.num, "!!!!");
					}
					check[msg.num] = false;
					c++;
					clearTimeout(end); end = setTimeout(function() {
						//console.log("?", c, check);
						if(Gun.obj.map(check, function(v){ if(v){ return v } })){ return }
						done();
					},100);
			});

			var said = gun.get('pub/asdf').get('who').get('said');

			function run(i){

				//console.log("----", i, "----");
				//2 === i && (console.debug.i = 1) && console.debug(1, '======= what happens?');
				//(console.debug.i = console.debug.i || 1);
				said.set({
					what: i + " Hello world!",
					num: i,
					who: 'asdf',
					id: 'alice',
				});

			}

			var i = 0, m = 9, to = setInterval(function frame(){
				if(m <= i){
					clearTimeout(to);
					return;
				}
				i++;
				check[i] = true;
				run(i);
			}, 1);

		});

		it('get map should not slowdown', function(done){
			this.timeout(5000);
			var gun = Gun({test_no_peer:true}).get('g/m/no/slow');
			//console.log("---------- setup data done -----------");
			var prev, diff, max = 25, total = 9, largest = -1, gone = {}, u;
			//var prev, diff, max = Infinity, total = 10000, largest = -1, gone = {};
			// TODO: It would be nice if we could change these numbers for different platforms/versions of javascript interpreters so we can squeeze as much out of them.
			gun.get('history').map().on(function(time, index){
				diff = Gun.time.is() - time;
				//console.log(">>>", index, time, diff);
				//return;
				expect(gone[index]).to.not.be.ok();
				gone[index] = diff;
			  largest = (largest < diff)? diff : largest;
			  expect(diff > max).to.not.be.ok();
			});
			var turns = 0;
			var many = setInterval(function() {
				if(turns > total || (diff || 0) > (max + 5)){
					if(u === diff){ return }
					clearTimeout(many);
			  	expect(Gun.num.is(diff)).to.be.ok();
			  	if(done.c){ return } done.c = 1;
			  	done();
			  	return;
			  }
			  prev = Gun.time.is();
			  var put = {}; put[turns += 1] = prev;
			  //console.log("put", put);
			  //console.log("------", turns, "-------");
			  //3 === turns && (console.debug.i = 1);
			  //console.debug(1, 'save', {history: put});
			  gun.put({history: put});
			}, 1);
		});

		it('Check put callback', function(done){
			var gun = Gun();

			gun.get('c/p/c').get('a').put('lol', function(){
				done();
			});
		});

		it('Multiple subscribes should trigger', function(done){
			// thanks to @ivkan for reporting and providing test.
			var gun = Gun();
			var check = {};
			gun.get('m/s/key').put({property: 'value'});

			gun.get('m/s/key').on(function(data, key){
				check['a'+data.property] = 1;
			});

			gun.get('m/s/key').on(function(data, key){
				check['b'+data.property] = 1;
			  if(check.avalue && check.bvalue && check.anewValue && check.bnewValue){
			  	if(done.c){ return } done.c = true;
			  	done();
			  }
			});

			setTimeout(function() {
				gun.get('m/s/key').put({property: 'newValue'});
			}, 1000);
		});

		it('Deep puts with peer should work', function(done){
			// tests in async mode now automatically connect to localhost peer.
			//var gun = Gun('http://localhost:8765/gun');
			var gun = Gun();
			//var user = gun.user();
			//user.create('alice', 'password', function() {
				gun.get('who').get('all').put({what: "hello world!", when: Gun.state()}, function(ack){
				//user.get('who').get('all').put({what: "hello world!", when: Gun.state()}, function(ack){
					gun.get('who').get('all').once(function(data){
						expect(data.what).to.be.ok();
						expect(data.when).to.be.ok();
						done();
					});
				});
			//});
		});

		it('Set a ref should be found', function(done){
			var gun = Gun();
			var msg = {what: 'hello world'};
			//var ref = user.get('who').get('all').set(msg);
			//user.get('who').get('said').set(ref);
			var ref = gun.get('s/r/who').get('all').set(msg);
			gun.get('s/r/who').get('said').set(ref);
			gun.get('s/r/who').get('said').map().once(function(data){
				expect(data.what).to.be.ok();
				done();
			})
		});

		/* DEAD CODE REMOVED */

	});
});

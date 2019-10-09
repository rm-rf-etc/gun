import { Gun } from './sea';
Gun.chain.then = function(cb){
	var gun = this, p = (new Promise(function(res, rej){
		gun.once(res);
	}));
	return cb? p.then(cb) : p;
}

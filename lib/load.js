import Open from './open';

export default (Gun) => {
	if (!Gun.chain.open) {
		Open(Gun);
	}
	Gun.chain.load = function(cb, opt, at){
		(opt = opt || {}).off = !0;
		return this.open(cb, opt, at);
	}
};

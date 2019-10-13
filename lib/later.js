import Open from './open';

export default (Gun) => {
	if (!Gun.chain.open) {
		Open(Gun);
	}

	Gun.chain.later = function(cb, age){
		var gun = this;
		age = age * 1000; // convert to milliseconds.
		setTimeout(function(){
			gun.open(cb, {off: true});
		}, age);
		return gun;
	}
};

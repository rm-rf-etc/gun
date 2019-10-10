import Type from './type';
import HAM from './HAM';
import val from './val';
import node from './node';

function Gun(o){
	if(o instanceof Gun){ return (this._ = {gun: this, $: this}).$ }
	if(!(this instanceof Gun)){ return new Gun(o) }
	return Gun.create(this._ = {gun: this, $: this, opt: o});
};

Gun.version = 0.9;
Gun.chain = Gun.prototype;

Type.obj.to(Type, Gun);
Object.assign(Gun, {
	HAM,
	val,
	node,
});

export default Gun;

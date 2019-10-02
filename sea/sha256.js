import shim from './shim';
export default async function(d, o){
	var t = (typeof d == 'string')? d : JSON.stringify(d);
	var hash = await shim.subtle.digest({name: o||'SHA-256'}, new shim.TextEncoder().encode(t));
	return shim.Buffer.from(hash);
}

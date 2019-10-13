import SEA from './sea';
import shim from './shim';
import S from './settings';
import sha from './sha256';
var u;

SEA.verify = SEA.verify || (async (data, pair, cb, opt) => { try {
	var json = S.parse(data);
	if(false === pair){ // don't verify!
		var raw = S.parse(json.m);
		if(cb){ try{ cb(raw) }catch(e){console.log(e)} }
		return raw;
	}
	opt = opt || {};
	// SEA.I // verify is free! Requires no user permission.
	var pub = pair.pub || pair;
	var key = SEA.opt.slow_leak? await SEA.opt.slow_leak(pub) : await (shim.ossl || shim.subtle).importKey('jwk', jwk, S.ecdsa.pair, false, ['verify']);
	var hash = await sha(json.m);
	var buf, sig, check, tmp; try{
		buf = shim.Buffer.from(json.s, opt.encode || 'base64'); // NEW DEFAULT!
		sig = new Uint8Array(buf);
		check = await (shim.ossl || shim.subtle).verify(S.ecdsa.sign, key, sig, new Uint8Array(hash));
		if(!check){ throw "Signature did not match." }
	}catch(e){
		if(SEA.opt.fallback){
			return await SEA.opt.fall_verify(data, pair, cb, opt);
		}
	}
	var r = check? S.parse(json.m) : u;

	if(cb){ try{ cb(r) }catch(e){console.log(e)} }
	return r;
} catch(e) {
	console.log(e); // mismatched owner FOR MARTTI
	SEA.err = e;
	if(SEA.throw){ throw e }
	if(cb){ cb() }
	return;
}});

export default SEA.verify;
// legacy & ossl leak mitigation:

// var knownKeys = {};
// var keyForPair = SEA.opt.slow_leak = pair => {
// 	if (knownKeys[pair]) return knownKeys[pair];
// 	var jwk = S.jwk(pair);
// 	knownKeys[pair] = (shim.ossl || shim.subtle).importKey("jwk", jwk, S.ecdsa.pair, false, ["verify"]);
// 	return knownKeys[pair];
// };


SEA.opt.fall_verify = async function(data, pair, cb, opt, f){
	if(f === SEA.opt.fallback){ throw "Signature did not match" } f = f || 1;
	var json = S.parse(data), pub = pair.pub || pair, key = await SEA.opt.slow_leak(pub);
	var hash = (f <= SEA.opt.fallback)? shim.Buffer.from(await shim.subtle.digest({name: 'SHA-256'}, new shim.TextEncoder().encode(S.parse(json.m)))) : await sha(json.m); // this line is old bad buggy code but necessary for old compatibility.
	var buf; var sig; var check; try{
		buf = shim.Buffer.from(json.s, opt.encode || 'base64') // NEW DEFAULT!
		sig = new Uint8Array(buf)
		check = await (shim.ossl || shim.subtle).verify(S.ecdsa.sign, key, sig, new Uint8Array(hash))
		if(!check){ throw "Signature did not match." }
	}catch(e){
		buf = shim.Buffer.from(json.s, 'utf8') // AUTO BACKWARD OLD UTF8 DATA!
		sig = new Uint8Array(buf)
		check = await (shim.ossl || shim.subtle).verify(S.ecdsa.sign, key, sig, new Uint8Array(hash))
		if(!check){ throw "Signature did not match." }
	}
	var r = check? S.parse(json.m) : u;
	if(cb){ try{ cb(r) }catch(e){console.log(e)} }
	return r;
}
SEA.opt.fallback = 2;

import SEA from './sea';
import shim from './shim';
import S from './settings';
import sha from './sha256';
var u;

SEA.sign = SEA.sign || (async (data, pair, cb, opt) => { try {
	opt = opt || {};
	if(!(pair||opt).priv){
		pair = await SEA.I(null, {what: data, how: 'sign', why: opt.why});
	}
	if(u === data){ throw '`undefined` not allowed.' }
	var json = S.parse(data);
	var check = opt.check = opt.check || json;
	if(SEA.verify && (SEA.opt.check(check) || (check && check.s && check.m))
	&& u !== await SEA.verify(check, pair)){ // don't sign if we already signed it.
		var r = S.parse(check);
		if(!opt.raw){ r = 'SEA'+JSON.stringify(r) }
		if(cb){ try{ cb(r) }catch(e){console.log(e)} }
		return r;
	}
	var pub = pair.pub;
	var priv = pair.priv;
	var jwk = S.jwk(pub, priv);
	var hash = await sha(json);
	var sig = await (shim.ossl || shim.subtle).importKey('jwk', jwk, S.ecdsa.pair, false, ['sign'])
	.then((key) => (shim.ossl || shim.subtle).sign(S.ecdsa.sign, key, new Uint8Array(hash))) // privateKey scope doesn't leak out from here!
	var r = {m: json, s: shim.Buffer.from(sig, 'binary').toString(opt.encode || 'base64')}
	if(!opt.raw){ r = 'SEA'+JSON.stringify(r) }

	if(cb){ try{ cb(r) }catch(e){console.log(e)} }
	return r;
} catch(e) {
	console.log(e);
	SEA.err = e;
	if(SEA.throw){ throw e }
	if(cb){ cb() }
	return;
}});

export default SEA.sign;

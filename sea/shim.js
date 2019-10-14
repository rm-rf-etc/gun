import { Crypto } from '@peculiar/webcrypto';
import textEncoding from 'text-encoding';
import cryptoLib from 'crypto';
import Buffer from './buffer';

const gThis = Function('return this')();
const crypto = gThis.crypto || gThis.msCrypto || cryptoLib;
const { TextEncoder, TextDecoder } = textEncoding;
const api = {
	Buffer,
	crypto,
	TextEncoder,
	TextDecoder,
	// subtle: crypto.subtle || crypto.webkitSubtle || null,
	// ossl: new WebCrypto({directory: 'ossl'}).subtle, // ECDH
	// subtle: new WebCrypto({directory: 'ossl'}).subtle, // ECDH
	random: (len) => (
		Buffer.from(crypto.getRandomValues(new Uint8Array(Buffer.alloc(len))))
	),
};
api.ossl = api.subtle = new Crypto({directory: 'ossl'}).subtle // ECDH

export default api;
// ?????
// Object.assign(api, {
// 	random: (len) => Buffer.from(crypto.randomBytes(len))
// });

// const globalThis = Function('return this')();
// api.crypto = globalThis.crypto || globalThis.msCrypto;
// api.TextEncoder = globalThis.TextEncoder;
// api.TextDecoder = globalThis.TextDecoder;

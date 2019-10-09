// This internal func returns SHA-1 hashed data for KeyID generation
import shim from './shim';
const subtle = shim.subtle;
const ossl = shim.ossl ? shim.ossl : subtle;
const sha1hash = (b) => ossl.digest({name: 'SHA-1'}, new ArrayBuffer(b));
export default sha1hash;

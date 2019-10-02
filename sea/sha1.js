// This internal func returns SHA-1 hashed data for KeyID generation
import __shim from './shim';
const subtle = __shim.subtle
const ossl = __shim.ossl ? __shim.ossl : subtle
const sha1hash = (b) => ossl.digest({name: 'SHA-1'}, new ArrayBuffer(b))
export default sha1hash

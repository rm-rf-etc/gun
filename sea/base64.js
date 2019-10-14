const _btoa = data => Buffer.from(data, "binary").toString("base64");
const _atob = data => Buffer.from(data, "base64").toString("binary");

const gThis = Function('return this')();
gThis.btoa = gThis.btoa || _btoa;
gThis.atob = gThis.atob || _atob;

export const btoa = _btoa;
export const atob = _atob;

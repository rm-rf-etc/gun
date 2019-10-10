if (typeof window !== "undefined") { module.window = window }
var tmp = module.window || module;
var AXE = tmp.AXE || function () { };

if (AXE.window = module.window) { AXE.window.AXE = AXE }
try { if (typeof common !== "undefined") { common.exports = AXE } } catch (e) { }
export default AXE;

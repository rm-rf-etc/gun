import fs from 'fs';
import expect from 'expect.js';
import fsrm from '../../lib/fsrm';
// import store from '../../lib/store';
import rfs from '../../lib/rfs';
import Gun from '../../dist/gun';
import GetRadix from '../../lib/radix';
import GetRadisk from '../../lib/radisk';

console.log('rad/rad/js');

//   var env;
//   if(typeof global !== 'undefined'){ env = global }
//   if(typeof window !== 'undefined'){ env = window }
//   const globalThis = env.window? env.window : global;
const globalThis = Function('return this')();
//   try{ env.window && globalThis.localStorage && globalThis.localStorage.clear() }catch(e){}
try{ globalThis.localStorage && globalThis.localStorage.clear() }catch(e){}
try{ indexedDB.deleteDatabase('radatatest') }catch(e){}
if(globalThis.Gun){
    globalThis.Gun.TESTING = true;
} else {
    try{ fs.unlinkSync('data.json') }catch(e){}
    try{ fsrm('radatatest') }catch(e){}
    globalThis.Gun = Gun;
    globalThis.Gun.TESTING = true;
    //require('../lib/file');
    // require('../../lib/store');
    // store(Gun);
    // require('../../lib/rfs');
    // rfs({});
}

// try{ global.expect = require("../expect") }catch(e){}
try{ globalThis.expect = expect }catch(e){}


// if(Gun.window && !Gun.window.RindexedDB){ return }

var opt = {};
opt.file = 'radatatest';
// var Radisk = (Gun.window && Gun.window.Radisk) || require('../../lib/radisk');

// opt.store = Gun && RindexedDB ? rfs(opt) : null;
opt.store = rfs(opt); // store(Gun);
opt.chunk = 1000;
const Radisk = GetRadisk(Gun, GetRadix);
const rad = Radisk(opt);
const Radix = Radisk.Radix;
// var esc = String.fromCharCode(27);

describe('RAD', function(){

    var names = ["Adalard","Adora","Aia","Albertina","Alfie","Allyn","Amabil","Ammamaria","Andy","Anselme","Ardeen","Armand","Ashelman","Aube","Averyl","Baker","Barger","Baten","Bee","Benia","Bernat","Bevers","Bittner","Bobbe","Bonny","Boyce","Breech","Brittaney","Bryn","Burkitt","Cadmann","Campagna","Carlee","Carver","Cavallaro","Chainey","Chaunce","Ching","Cianca","Claudina","Clyve","Colon","Cooke","Corrina","Crawley","Cullie","Dacy","Daniela","Daryn","Deedee","Denie","Devland","Dimitri","Dolphin","Dorinda","Dream","Dunham","Eachelle","Edina","Eisenstark","Elish","Elvis","Eng","Erland","Ethan","Evelyn","Fairman","Faus","Fenner","Fillander","Flip","Foskett","Fredette","Fullerton","Gamali","Gaspar","Gemina","Germana","Gilberto","Giuditta","Goer","Gotcher","Greenstein","Grosvenor","Guthrey","Haldane","Hankins","Harriette","Hayman","Heise","Hepsiba","Hewie","Hiroshi","Holtorf","Howlond","Hurless","Ieso","Ingold","Isidora","Jacoba","Janelle","Jaye","Jennee","Jillana","Johnson","Josy","Justinian","Kannan","Kast","Keeley","Kennett","Kho","Kiran","Knowles","Koser","Kroll","LaMori","Lanctot","Lasky","Laverna","Leff","Leonanie","Lewert","Lilybel","Lissak","Longerich","Lou","Ludeman","Lyman","Madai","Maia","Malvina","Marcy","Maris","Martens","Mathilda","Maye","McLain","Melamie","Meras","Micco","Millburn","Mittel","Montfort","Moth","Mutz","Nananne","Nazler","Nesta","Nicolina","Noellyn","Nuli","Ody","Olympie","Orlena","Other","Pain","Parry","Paynter","Pentheas","Pettifer","Phyllida","Plath","Posehn","Proulx","Quinlan","Raimes","Ras","Redmer","Renelle","Ricard","Rior","Rocky","Ron","Rosetta","Rubia","Ruttger","Salbu","Sandy","Saw","Scholz","Secor","September","Shanleigh","Shenan","Sholes","Sig","Sisely","Soble","Spanos","Stanwinn","Stevie","Stu","Suzanne","Tacy","Tanney","Tekla","Thackeray","Thomasin","Tilla","Tomas","Tracay","Tristis","Ty","Urana","Valdis","Vasta","Vezza","Vitoria","Wait","Warring","Weissmann","Whetstone","Williamson","Wittenburg","Wymore","Yoho","Zamir","Zimmermann"];

    //console.log("HYPER TEST");var z = 10000; while(--z){ names.push(Gun.text.random(7)) }this.timeout(9000);

    describe('Radix', function(){
        const radix = Radix();
        it('radix write read', function(done){
            var all = {};
            names.forEach(function(v,i){
                v = v.toLowerCase();
                all[v] = v;
                radix(v, i)
            });
            expect(Gun.obj.empty(all)).to.not.be.ok();
            Radix.map(radix, function(v,k){
                delete all[k];
            });
            expect(Gun.obj.empty(all)).to.be.ok();
            done();
        });

        it('radix write read again', function(done){
            var all = {};
            names.forEach(function(v,i){
                v = v.toLowerCase();
                all[v] = v;
                //rad(v, i)
            });
            expect(Gun.obj.empty(all)).to.not.be.ok();
            Radix.map(radix, function(v,k){
                delete all[k];
            });
            expect(Gun.obj.empty(all)).to.be.ok();
            done();
        });

        it('radix read start end', function(done){
            var all = {}, start = 'Warring'.toLowerCase(), end = 'Zamir'.toLowerCase();
            names.forEach(function(v,i){
                v = v.toLowerCase();
                if(v < start){ return }
                if(end < v){ return }
                all[v] = v;
                //rad(v, i)
            });
            expect(Gun.obj.empty(all)).to.not.be.ok();
            Radix.map(radix, function(v,k, a,b){
                //if(!all[k]){ throw "out of range!" }
                delete all[k];
            }, {start: start, end: end});
            expect(Gun.obj.empty(all)).to.be.ok();
            done();
        });

        it('radix read start- end+', function(done){
            var all = {}, start = 'Warrinf'.toLowerCase(), end = 'Zamis'.toLowerCase();
            names.forEach(function(v,i){
                v = v.toLowerCase();
                if(v < start){ return }
                if(end < v){ return }
                all[v] = v;
                //rad(v, i)
            });
            expect(Gun.obj.empty(all)).to.not.be.ok();
            Radix.map(radix, function(v,k, a,b){
                //if(!all[k]){ throw "out of range!" }
                delete all[k];
            }, {start: start, end: end});
            expect(Gun.obj.empty(all)).to.be.ok();
            done();
        });

        it('radix reverse', function(done){
            var r = Radix(), tmp;
            r('alice', 1);r('bob', 2);r('carl', 3);r('carlo',4);
            r('dave', 5);r('zach',6);r('zachary',7);
            var by = ['alice','bob','carl','carlo','dave','zach','zachary'];
            Gun.obj.map(by, function(k,i){
                r(k,i);
            });
            Radix.map(r, function(v,k, a,b){
                expect(by.pop()).to.be(k);
                tmp = v;
            }, {reverse: 1});
            expect(tmp).to.be(1);
            expect(by.length).to.be(0);
            Radix.map(r, function(v,k, a,b){
                tmp = v;
            });
            expect(tmp).to.be(7);
            done();
        });
    });

    describe('Radisk', function(){

        /*it('parse', function(done){
            this.timeout(60000);
            if(Gun.window){ return done() }
            var raw = require('fs').readFileSync(__dirname + '/parse.rad').toString();
            rad.parse('!', function(err, disk){
                console.log("!!!!", err);
            }, raw);
            return;
        });*/


        it('write contacts', function(done){
            var all = {}, to, start;
            names.forEach(function(v,i){
                v = v.toLowerCase();
                all[v] = true;
                rad(v, i, function(err, ok){
                    expect(err).to.not.be.ok();
                    delete all[v];
                    if(!Gun.obj.empty(all)){ return }
                    done();
                })
            })
        });

        /*it('read contacts reverse', function(done){
            var opt = {};
            opt.reverse = true;
            opt.end = 'nothing';
            opt.start = 'marcy';
            var first, last;
            rad('', function(err, data){
                console.log("???", err, data);
                return;
                Radix.map(data, function(v,k){
                    console.log(k, v);
                    //delete all[find+k];
                });
                //if(!Gun.obj.empty(all)){ return }
                //done();
            }, opt);
        });
        console.log("UNDO THIS RETURN!!!");return;*/

        it('read contacts start end', function(done){
            var opt = {};
            opt.start = 'Warring'.toLowerCase();
            opt.end = 'Zamir'.toLowerCase();
            var all = {}, find = '';
            names.forEach(function(v){
                v = v.toLowerCase();
                if(v < opt.start){ return }
                if(opt.end < v){ return }
                if(v.indexOf(find) == 0){ all[v] = true }
            });
            rad(find, function(err, data){
                Radix.map(data, function(v,k){
                    //console.log(find+k, v);
                    delete all[find+k];
                });
                if(!Gun.obj.empty(all)){ return }
                done();
            }, opt);
        });

        it('read contacts', function(done){
            var all = {}, find = 'a';
            names.forEach(function(v){
                v = v.toLowerCase();
                if(v.indexOf(find) == 0){ all[v] = true }
            });
            rad(find, function(err, data){
                //console.log(">>>>>>>>> KUNG FOO PANDA <<<<<<<<<<<");
                //console.debug.i=1;console.log(data);
                Radix.map(data, function(v,k){
                    delete all[find+k];
                });
                if(!Gun.obj.empty(all)){ return }
                done();
            });
        });

        it('read again', function(done){
            var all = {}, find = 'm';
            names.forEach(function(v){
                v = v.toLowerCase();
                if(v.indexOf(find) == 0){ all[v] = true }
            });
            rad(find, function(err, data, info){
                Radix.map(data, function(v,k){
                    delete all[find+k];
                });
                if(!Gun.obj.empty(all)){ return }
                done();
            });
        });

        it('read bytes', function(done){
            var all = {}, find = 'm', to;
            names.forEach(function(v){
                v = v.toLowerCase();
                if(v.indexOf(find) == 0){ all[v] = true }
            });
            rad(find, function(err, data, info){
                Radix.map(data, function(v,k){
                    delete all[find+k];
                });
                clearTimeout(to);
                to = setTimeout(function(){
                    expect(Gun.obj.empty(all)).to.not.be.ok();
                    done();
                },100);
            }, {limit: 1});
        });

    });

    describe('RAD + GUN', function(){
        var ochunk = 1000;
        var gun = Gun({chunk: ochunk});

        it('write same', function(done){
            var all = {}, to, start, tmp;
            var names = [], c = 285;
            while(--c){ names.push('bob') }
            names.forEach(function(v,i){
                all[++i] = true;
                tmp = v.toLowerCase();
                gun.get('names').get(tmp).put({name: v, age: i}, function(ack){
                    expect(ack.err).to.not.be.ok();
                    delete all[i];
                    if(!Gun.obj.empty(all)){ return }
                    done();
                })
            });
        });

        it('write contacts', function(done){
            var all = {}, to, start, tmp;
            names.forEach(function(v,i){
                all[++i] = true;
                tmp = v.toLowerCase();
                gun.get('names').get(tmp).put({name: v, age: i}, function(ack){
                    expect(ack.err).to.not.be.ok();
                    delete all[i];
                    if(!Gun.obj.empty(all)){ return }
                    done();
                })
            })
        });

        it('read contacts', function(done){
            var all = {}, find = 'm', to;
            names.forEach(function(v){
                v = v.toLowerCase();
                if(v.indexOf(find) == 0){ all[v] = true }
            });
            gun.get('names').get({'.': {'*': find}, '%': 1000 * 100}).once().map().once(function(data, key){
                expect(data.name).to.be.ok();
                expect(data.age).to.be.ok();
                delete all[key];
                clearTimeout(to);
                to = setTimeout(function(){
                    expect(Gun.obj.empty(all)).to.be.ok();
                    done();
                },100);
            });
        });

        it('read contacts again', function(done){
            var all = {}, find = 'a', to;
            names.forEach(function(v){
                v = v.toLowerCase();
                if(v.indexOf(find) == 0){ all[v] = true }
            });
            gun.get('names').get({'.': {'*': find}, '%': 1000 * 100}).once().map().once(function(data, key){
                expect(data.name).to.be.ok();
                expect(data.age).to.be.ok();
                delete all[key];
                clearTimeout(to);
                to = setTimeout(function(){
                    expect(Gun.obj.empty(all)).to.be.ok();
                    done();
                },100);
            });
        });

        it('read contacts fresh', function(done){
            var gun = Gun({chunk: ochunk});
            var all = {}, find = 'b', to;
            names.forEach(function(v){
                v = v.toLowerCase();
                if(v.indexOf(find) == 0){ all[v] = true }
            });
            gun.get('names').get({'.': {'*': find}, '%': 1000 * 100}).once().map().once(function(data, key){
                expect(data.name).to.be.ok();
                expect(data.age).to.be.ok();
                delete all[key];
                clearTimeout(to);
                to = setTimeout(function(){
                    expect(Gun.obj.empty(all)).to.be.ok();
                    done();
                },100);
            });
        });

    });

});

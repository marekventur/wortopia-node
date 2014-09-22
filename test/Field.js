require('./setup');

describe('Field', function() {
    var field;
    context('(functional)', function() {
        beforeEach(function() {
            setUpDi();

            field = [
                ['n', 'r', 'u', 'd'],
                ['e', 't', 'e' ,'m'],
                ['a', 's', 'e', 'n'],
                ['m', 'r', 't', 'n']
            ];
            di.get('fieldDecorator').decorate(field);
        });

        it('return size', function() {
            assert.equal(field.getSize(), 4);
        });

        it('calculates all starting positions', function() {

            assert.deepEqual(field.getAllStartingCombinations(), ["nr","nt","ne","rn","re","ru","rt","ur","ut","ud","um","ue","du","de","dm","et","er","es","en","ea","te","tn","ta","tu","tr","ts","em","ed","eu","ee","me","mu","md","mn","as","at","ar","ae","am","sa","se","sm","st","sr","nm","nn","mr","ms","ma","rm","ra","rs"]);
        });

        it.skip('fetches all words', function(done) {
            field.getWords()
            .done(function(words) {
                assert.deepEqual(_.pluck(words, 'word'), ["arm","arsen","art","arten","ase","ast","asten","aster","atem","aesen","aeste","aesten","demut","denen","deren","deut","deuter","deutet","dur","duene","duenen","duenn","duenne","duennes","duese","duester","duestern","emd","emden","emdet","emeute","emu","entarten","entase","ente","enten","entente","enter","entraten","entrees","entree","entremets","entruesten","eren","ern","ernte","ernten","erntet","erst","erste","ersten","erster","erstere","ertasten","ester","eta","eure","euter","ted","neeren","mars","masern","mast","masten","mastente","master","mater","materne","matur","maer","maere","maeren","maesten","maestet","meer","meere","meeresarm","meste","meter","metern","meute","meutern","mur","muren","mut","muta","muten","muter","neer","staer","nest","neu","neume","raser","raseur","raste","rasten","raster","rastern","rat","rater","raet","reat","reesen","reet","remedur","ren","renner","rennt","rente","renten","rentner","rest","reste","return","reuten","rum","rumen","artest","rute","ruten","ruesten","ruestet","sarte","saturn","saet","sedum","seen","sen","senn","senner","sennte","seren","serum","smart","star","stare","start","starten","staeren","steam","stennerte","sterne","stert","stete","streu","student","studenten","taste","tasten","taster","team","teeren","teert","tees","tenne","term","terms","terne","test","testen","tester","tetra","teure","teuren","tram","trat","traeteur","trenner","trennt","tresen","trester","treten","treter","trum","turn","tuere","tueren","urea","urease","urese","ureter","urne","artet","dem","set","teste","meeres","nester","teere","ree","teers","sture","tue","resten","eures","euren","turne","este","raete","ratet","treu","tuer","trenne","mute","esten","nestern","semen","maser","mure","aesern","steten","duesen","trete","are","tenn","ster","teams","rats","saeten","saete","euters","sturen","mutet","senne","teerst","dement","arms","erstem","aese","mate","mutes","duenner","rastet","testern","dueste","rene","meta","reute","sennt","meers","duest","deuten","tee","met","reets","rasern","aeser","den","raeten","rates","see","maeste","aser","aste","rentners","asen","meeren","teures","rueste","duesten","staren","enters","der","astern","aeren","meuten","tarte","traent","stern","teerte","ure","reset","meters","rast","rasen","rase","ares","teer","raten","rate","denn","res","mare","stent","stur","tea","renne","teerten","sem","steter","des","taser","renes","renners","teeres","teas","entert","muts","enterst","starte","maste","artete","sera","eutern","trennte","rennern","mutest","deutern","stetem","rastete","duennem","astet","seme","deutest","ratern","uren","erntest","trams","maester","meutert","rasteten","estern","rastere","smarte","smarten","ersteren","ersterem","raetst","traete","rentnern","ras","saetet","aestet","tarten","deuters","ruestete","ruesteten","steren","stetere","sennern","metren","tasern","senntet","traente","tarsen","restern","sae","rener","steteren","traenten","ententen","sturem","astete","mesa","steterem","entrueste","arteten","meuterst","entarte","tretern","duestet","ertaste","traeten","teten","ruester","ennet","stet","teen","tete","traten","stere","aest","deute","renen","aren","need","rester","mets","teaser","staere","reut","emde","emdes","dentes","etas","neese","mud","rees","reese","reeset","reest","reesten","reu","mutern","muters","demen","tuest","turnest","due","ures","reeste","reutest","reutet","maerest","maeret","maert","maerte","maerten","maertest","maertet","asern","aester","aestern","duete","dueten","net","nets","aeset","aes","arte","rennte","renntest","renntet","rennet","rennest","trennest","trennet","trennern","trenners","rume","ureate","ureaten","ureates","ureats","ureasen","red","neste","renn","ruest","serene","serenem","serener","serenen","sere","trenn","reate","reaten","reates","reats","murest","muret","murt","murte","murten","murtest","murtet","teeret","teerest","dumen","sennet","traen","dues","dueset","duestert","emdest","emdete","emdeten","emdetest","matern","maternes","matere","materst","matert"]);
                done();
            });
        });

        it('#contains finds words', function() {
            assert.deepEqual(field.contains('NR'), [ { x: 0, y: 0 }, { x: 1, y: 0 } ]);
            assert.deepEqual(field.contains('Nt'), [ { x: 0, y: 0 }, { x: 1, y: 1 } ]);
            assert.deepEqual(field.contains('nrud'), [ { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 } ]);
            assert.deepEqual(field.contains('mars'), [ { x: 0, y: 3 }, { x: 0, y: 2 }, { x: 1, y: 3 }, { x: 1, y: 2 } ]);
            assert.equal(field.contains('nrudt'), null);
            assert.equal(field.contains('nenee'), null);
            assert.equal(field.contains('ss'), null);
        });


    });

    context('(specific)', function() {
        beforeEach(function() {
            setUpDi();

            field = [
                ['r', 'n', 'u', 'e'],
                ['h', 'n', 'l' ,'a'],
                ['i', 'm', 'n', 'a'],
                ['a', 'r', 't', 'e']
            ];
            di.get('fieldDecorator').decorate(field);
        });

        it('calculates all starting positions', function() {
            var combinations = field.getAllStartingCombinations();
            assert.ok(_.contains(combinations, 'am'));
        });

        it('fetches all words', function(done) {
            field.getWords()
            .done(function(words) {
                var reference = 'LAU ULNAE AUL IHR HIRN AMT HIRNTE AUE ANAL AIR ELAN ALAN RINN ANE AMTEN IHM TRAM IHN AAL ULM ANA TALMI ALANTE ARTE MINNE ALAUN ALANT HIN ALU HIRNT AINU TANN ANALE ARM MINNA ALM ETA AMIN AMI MINNT ALMT ALANE HIRNE MINNTE RINNET AULA AULE TALMIN MARI MINN ALMTEN ALMA RINNE TRI INULA TRAIN RIA MIR MARIN ALA ART ARTEN ALE UNI ALMTE RINNT ULAN TAL NUN TEA TALAN MINNET LAUE NET HIRTE ARIN TALE MAI AALE HIRT ULNA ANTE HIRNET TENN RAIN EULAN LEU AMTE HIRTEN INNE';
                reference = reference.split(' ').map(function(word) {return word.toLowerCase()}).sort();

                assert.deepEqual(reference.sort(), _.pluck(words, 'word').sort());
                done();
            });
        });
    });

    context('(specific 2)', function() {
        beforeEach(function() {
            setUpDi();

            field = [
                ['e', 'u', 'r', 'i'],
                ['e', 'm', 'e' ,'n'],
                ['e', 'n', 'i', 'g'],
                ['h', 'd', 'r', 'r']
            ];
            di.get('fieldDecorator').decorate(field);
        });

        it('#contains finds words', function() {
            assert.deepEqual(field.contains('men'), [ { x: 1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 2 } ]);
        });
    });

});

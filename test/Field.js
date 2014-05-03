require('./setup')

describe('Field', function() {

    var field;
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
        assert.deepEqual(field.getAllStartingCombinations(), ["nr","rn","ru","ur","ud","du","et","te","em","me","as","sa","se","es","en","ne","mr","rm","rt","tr","tn","nt"]);
    });

    it('fetches all words', function(done) {
        field.getWords()
        .done(function(words) {
            assert.deepEqual(words, ["ase","ast","asten","aster","du","dur","duene","duenen","duenn","duenne","duennes","duese","duester","duestern","emd","emden","emdet","emeute","emu","entarten","entase","ente","enten","entente","enter","entraten","entrees","entree","entremets","entruesten","es","ester","et","eta","ted","neeren","meer","meere","meeresarm","meste","meter","metern","meute","meutern","ne","neer","nest","neu","neume","rum","rumen","rute","ruten","ruesten","ruestet","sarte","saturn","saet","sedum","seen","sen","senn","senner","sennte","seren","serum","team","teeren","teert","tees","tenne","term","terms","terne","test","testen","tester","tetra","teure","teuren","tram","trat","traeteur","trenner","trennt","tresen","trester","treten","treter","trum","ur","urea","urease","urese","ureter","urne","as","set","teste","meeres","nester","teere","teers","este","treu","trenne","esten","nestern","semen","duesen","trete","tenn","teams","saeten","saete","senne","teerst","duenner","testern","dueste","meta","sennt","meers","duest","tee","met","see","aser","aste","asen","meeren","teures","rueste","duesten","enters","astern","meuten","traent","teerte","ure","meters","teer","tea","teerten","sem","teeres","teas","entert","enterst","sera","trennte","duennem","astet","seme","uren","trams","meutert","estern","traete","saetet","ruestete","ruesteten","sennern","metren","senntet","traente","sae","traenten","ententen","astete","mesa","entrueste","meuterst","entarte","tretern","duestet","traeten","teten","ruester","ennet","teen","tete","traten","need","mets","teaser","emde","emdes","etas","neese","due","ures","asern","duete","dueten","net","nets","trennest","trennet","trennern","trenners","rume","ureate","ureaten","ureates","ureats","ureasen","neste","ruest","serene","serenem","serener","serenen","sere","trenn","teeret","teerest","dumen","sennet","traen","dues","dueset","duestert","emdest","emdete","emdeten","emdetest"]);
            done();
        });
    });

    it('#contains works correctly', function() {
        assert.ok(field.contains('NR'));
        assert.ok(field.contains('Nt'));
        assert.ok(field.contains('Nt'));
        assert.ok(field.contains('nrud'));
        assert.ok(field.contains('mars'));
        assert.notOk(field.contains('nrudt'));
        assert.notOk(field.contains('nenee'));
        assert.notOk(field.contains('ss'));
    });

});

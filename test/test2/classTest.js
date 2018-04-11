export default class Names extends Enter {
    constructor(a, b) {
        console.log(a, b);
        return a;
    }
    static methodsName(some, def) {
        return 'hi';
    }
    static defFunc(asd) {
        return asd.map(i=>i**2);
    }
}
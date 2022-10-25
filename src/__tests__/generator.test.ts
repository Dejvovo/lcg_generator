import { generateLCG, isDivisibleByFactors, primeFactors } from "../generator/generator";

describe("Tests", () => {
    const x: number[] = [];
    x.fill(2, 0, 31);
    
    it("tests prime factors.", () => {
        expect(primeFactors(3)).toEqual([3]);
        expect(primeFactors(2**31)).toEqual(new Array(31).fill(2));
        expect(primeFactors(17)).toEqual([17]);
        expect(primeFactors(12)).toEqual([2, 2, 3]);
        expect(primeFactors(124214)).toEqual([2, 173, 359]);
        expect(primeFactors(112521552)).toEqual([2, 2, 2, 2, 3, 11, 13, 13, 13, 97]);
        expect(primeFactors(11252134552)).toEqual([2, 2, 2, 19, 107, 691843]);
    });

    it("tests divisibility by factors.", () => {
        // expect(isDivisibleByFactors(12, [3, 4])).toEqual(true);
        // expect(isDivisibleByFactors(12, [3, 5])).toEqual(false);
        // expect(isDivisibleByFactors(11035115245 -1, primeFactors(2**31))).toEqual(true);
        // expect(isDivisibleByFactors(1664525 -1, primeFactors(2**32))).toEqual(true);
        // 1977774107
        // 1957092677
        // 2159583557
    });

    it("generates LCG", () => {
        expect(generateLCG(undefined, 12345, 2**32)).toBe({})
    })
})
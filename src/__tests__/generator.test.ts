import { condition1, condition2, condition3, generateLCG, isDivisibleByFactors, primeFactors } from "../generator/generator";

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


    it("tests condition1", () => {
        // 1) C a M jsou nesoudělná čísla
        expect(condition1(2, 5)).toBe(true);
        expect(condition1(6, 8)).toBe(false);
        expect(condition1(3*5*17*23, 3*7*19)).toBe(false);
        expect(condition1(5*17*23, 7*19)).toBe(true);
    })

    it("tests condition2", () => {
        // 2) A-1 je dělitelné všemi prvočíselnými faktory M
        expect(condition2(3, 2)).toBe(true);
        expect(condition2(4, 2)).toBe(false);
        expect(condition2(2*3*5+1, 2*3*5)).toBe(true);
        expect(condition2(2*3*5+1, 2*3*5*7)).toBe(false);

        expect(condition2(1681744473, 2**32)).toBe(true);
    })

    it("tests condition3", () => {
        // 3) když M je násobek 4, tak A-1 taky
        expect(condition3(3, 1)).toBe(true);
        expect(condition3(4, 1)).toBe(true);
        expect(condition3(4 + 1, 4)).toBe(true);
        expect(condition3(4, 4)).toBe(false);

        expect(condition3(8, 2**32)).toBe(false);
        expect(condition3(9, 2**32)).toBe(true);
    })

    it("generates correct LCG", () => {
        // Does not hold condition1.
        expect(() => generateLCG(3, 3*5*17*23, 3*7*19)).toThrowError();
        expect(() => generateLCG(3, 6, 8)).toThrowError();

        // Does not hold condition2.
        expect(() => generateLCG(4, 12345, 2)).toThrowError();
        expect(() => generateLCG(2*3*5+1, 12345, 2*3*5*7)).toThrowError();

        // Does not hold condition3.
        expect(() => generateLCG(4, 12345, 2**2)).toThrowError();
        expect(() => generateLCG(8, 12345, 2**32)).toThrowError();
    })
})
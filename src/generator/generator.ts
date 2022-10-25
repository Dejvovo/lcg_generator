// Generátor LCG: x_i+1= (A*x_i + C) mod M má plnou periodu M, právě tehdy když: 
// 1) C a M jsou nesoudělná čísla
// 2) A-1 je dělitelné všemi prvočíselnými faktory M
// 3) když M je násobek 4, tak A-1 taky

export const primeFactors = (n: number) => {
    const factors = [];
    let divisor = 2;

    while (n >= 2) {
        if (n % divisor === 0) {
            factors.push(divisor);
            n /= divisor;
        } else {
            divisor++;
        }
    }
    return factors;
}

export const isDivisibleByFactors = (n: number, factors: number[]) => {
    for (const factor of factors) {
        if (n % factor !== 0) {
            return false;
        }
    }
    return true;
}

export const greatestCommonDivisor = (a: number, b: number) => {
    while(b !== 0) {
        const c = b;
        b = a % b;
        a = c;
    }

    return a;
}

export const areCoprime = (a: number, b: number) => {
    return greatestCommonDivisor(a, b) === 1;
}

const isDivisibleBy = (n: number, by: number) => n % by === 0;

// 1) C a M jsou nesoudělná čísla
export const condition1 = (C: number, M: number) => areCoprime(C, M);

// 2) A-1 je dělitelné všemi prvočíselnými faktory M
export const condition2 = (A: number, M: number, primeFactorsOfM?: number[]) => isDivisibleByFactors(A-1, primeFactorsOfM || primeFactors(M));

// 3) když M je násobek 4, tak A-1 taky
export const condition3 = (A: number, M: number) => isDivisibleBy(M, 4) ? (isDivisibleBy(A-1, 4)) : true;

/**
 * Generuje náhodné celé číslo v zadaných mezích VČETNĚ.
 */
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max + 1 - min) + min);
const randomOddInt = (min: number, max: number) => randomInt(0, max /2) * 2 + 1;


const generateTriplet = (a?: number, c?: number, m?: number): ILCG => {
    const M = m || 2**32;
    const A = a || randomInt(0, M);
    const C = c || randomOddInt(0, M);

    return {A, C, M};
}

export interface ILCG {
    A: number;
    C: number;
    M: number;
}

/**
 * Generuje trojici čísel A, C, M pro Lineární kongruentní generátor.
 * Na vstupu, mohu některé parametry A, C, M zafixovat. Generátor se poté pokusí dogenerovat ta zbývající.
 * Generování probíhá tak, že generátor se snaží postupně "uhádnout" parametry, které vyhovují zadání. 
 * Generátor hádá maximálně @maxIterations krát. 
 * @param maxIterations Maximální počet pokusů na uhodnutí, než to generátor vzdá.
 * @throws Vyhodí chybu, pokud je překročen maximální počet pokusů: @maxIterations .
 */
export const generateLCG = (a?: number, c?: number, m?: number, maxIterations: number = 10**3): ILCG=> {   
    let triplet = generateTriplet(a, c, m);
    let iterations = 0;
    let primeFactorsOfM = m ? primeFactors(m) : undefined;

    while(true) {
        if(iterations > maxIterations) throw new Error("Bohužel pro zadaný vstup se nepodařilo uhodnout všechny parametry.");
        iterations++;

        if(!condition3(triplet.A, triplet.M)) {
            triplet = generateTriplet(a, c, m);
            continue;
        }
        if(!condition1(triplet.C, triplet.M)) {
            triplet = generateTriplet(a, c, m);
            continue;
        }
        if(!condition2(triplet.A, triplet.M, primeFactorsOfM)) {
            triplet = generateTriplet(a, c, m);
            continue;
        }

        console.log("Number of iterations: ", iterations);
        break;
    }

    return triplet;
}
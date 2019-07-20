'use strict';


let inputString = '';
let currentLine = 0;

function *generatePrime(n){
    for (let i = 2; i < n; i++) {
        let prime = true;
        for (let j = i-1; j > 1; j--) {
            if (i%j == 0) {
                prime = false;
                break;
            }
        }
        if (prime) {
            yield i;
        }
    }
}

let getPrimes = (n) => {
    return generatePrime(n);
}

function main() {
    
    let n = 10;
    let gen = getPrimes(n);
    let res = [];

    for (let i = 0; i < n; i++) {
        let val = gen.next().value;
        if (val == undefined)
            break;
        res.push(val);
    }

    console.log(res.join("\n") + "\n");
}

main();
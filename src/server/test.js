const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let result = '';

// https://stackoverflow.com/questions/36129721/convert-number-to-alphabet-letter
function printToLetter( number ) {
    let charIndex = number % alphabet.length;
    let quotient = number / alphabet.length;
    if ( charIndex - 1 === -1 ) {
        charIndex = alphabet.length;
        quotient --;
    }
    result = alphabet.charAt( charIndex - 1 ) + result;
    if ( quotient >= 1 ) {
        printToLetter( parseInt( quotient ) );
    }
}

printToLetter( 150036 );
console.log( result );
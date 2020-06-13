function add (addend, addend2) {
	return addend + addend2;
}

function subtract (minuend, subtrahend) {
	return minuend - subtrahend;
}

function multiply (array) {
    return array.reduce((product, multiplier) => product * multiplier);
}

function divide (dividend, divisor) {
    return (divisor != 0)? dividend/divisor: "invalid operation";
}
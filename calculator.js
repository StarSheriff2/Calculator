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

function operate(operand1, operator, operand2) {
    return (operator == "add")? add(operand1, operand2): (operator == "subtract")? subtract(operand1, operand2):
    (operator == "multiply")? multiply([operand1, operand2]): divide (operand1, operand2);
}

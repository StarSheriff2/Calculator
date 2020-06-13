const mathOperations = {
    operate: function(operand1, operator, operand2) {
        return  (operator == "add")? this.add(operand1, operand2): 
                (operator == "subtract")? this.subtract(operand1, operand2):
                (operator == "multiply")? this.multiply([operand1, operand2]): 
                divide (operand1, operand2);
    },
    add: function(addend, addend2) {
        return addend + addend2;
    },
    subtract: function(minuend, subtrahend) {
        return minuend - subtrahend;
    },
    multiply: function(array) {
        return array.reduce((product, multiplier) => product * multiplier);
    },
    divide: function(dividend, divisor) {
        return (divisor != 0)? dividend/divisor: "invalid operation";
    },
};














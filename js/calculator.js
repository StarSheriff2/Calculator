const displayDiv = document.querySelector("#displayDiv");
const displayStyle = displayDiv.style;
const numberbtn = document.querySelectorAll(".numberbtn");
const operatorBtn = document.querySelectorAll(".operatorBtn");
let storedOperation;
const kEquals = document.querySelector("#kEquals");


Array.from(numberbtn).forEach(bt => bt.addEventListener("click", e => {
    displayFunctions.display(e.target.id);
}));

Array.from(operatorBtn).forEach(bt => bt.addEventListener("click", e => {
    console.log(e.target.id);
    displayFunctions.storedOperator = (e.target.id);
    storedOperation = [displayFunctions.storedOperand, displayFunctions.storedOperator];
    displayFunctions.storedOperand = "";
}));

kEquals.addEventListener("click", _ => {
    console.log(storedOperation[0],storedOperation[1], 
        (displayFunctions.storedOperand == "")? storedOperation[0]: displayFunctions.storedOperand);
        displayDiv.textContent = mathOperations.operate(storedOperation[0], storedOperation[1], 
        (displayFunctions.storedOperand == "")? storedOperation[0]: displayFunctions.storedOperand);  
});

const displayFunctions = {
    storedOperand: "",
    storedOperator: "",
    display: function(key) {
        displayDiv.textContent = `${document.querySelector(`#${key}`).textContent}`;
        this.storedOperand = displayDiv.textContent*1;
        console.log(this.storedOperand);
    },
    /*storedOperation: function() {
        const storedOperand = this.storedOperand;
        const operand = storedOperand;
        const operator = this.storedOperator;
        console.log(storedOperand, operand);
        console.log(operand, operator);
        return operand, operator;
    },*/
};


const mathOperations = {
    operate: function(operand1, operator, operand2) {
        return  (operator == "kAdd")? this.add(operand1, operand2): 
                (operator == "kSubtract")? this.subtract(operand1, operand2):
                (operator == "kMultiply")? this.multiply([operand1, operand2]): 
                divide(operand1, operand2);
    },
    add: function(addend, addend2) {
        console.log(addend + addend2);
        return (addend + addend2);
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














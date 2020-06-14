const displayDiv = document.querySelector("#displayDiv");
const displayStyle = displayDiv.style;
const numberbtn = document.querySelectorAll(".numberbtn");
const operatorBtn = document.querySelectorAll(".operatorBtn");
let storedOperation = "";
const kEquals = document.querySelector("#kEquals");
const clear = document.querySelector("#kC");


Array.from(numberbtn).forEach(bt => bt.addEventListener("click", e => {
    if (displayFunctions.storedOperand == "") displayDiv.textContent = "";
    displayFunctions.display(e.target.id);
}));

Array.from(operatorBtn).forEach(bt => bt.addEventListener("click", e => {
    console.log(e.target.id);
    storedOperation = [((displayFunctions.storedOperand == "")? storedOperation[0]: displayFunctions.storedOperand), e.target.id];
    displayFunctions.storedOperand = "";
}));

kEquals.addEventListener("click", _ => {
    console.log(storedOperation[0],storedOperation[1], 
        displayFunctions.storedOperand);
    displayDiv.textContent = mathOperations.operate(storedOperation[0], storedOperation[1], 
        (displayFunctions.storedOperand == "")? storedOperation[2]: displayFunctions.storedOperand);
        console.log(storedOperation[0], storedOperation[1], 
            (displayFunctions.storedOperand == "")? storedOperation[2]: displayFunctions.storedOperand);
    const result = displayDiv.textContent*1;  
    storedOperation[0] = result;
    if (!storedOperation[2]) storedOperation[2] = displayFunctions.storedOperand;
    displayFunctions.storedOperand = ""; 
});

clear.addEventListener("click", _ => {
    secondaryOperations.clear();
});

const displayFunctions = {
    storedOperand: "",
    display: function(key) {
        displayDiv.textContent += `${document.querySelector(`#${key}`).textContent}`;
        this.storedOperand = displayDiv.textContent*1;
        console.log(this.storedOperand);
    },
};

const mathOperations = {
    operate: function(operand1, operator, operand2) {
        return  (operator == "kAdd")? this.add(operand1, operand2): 
                (operator == "kSubtract")? this.subtract(operand1, operand2):
                (operator == "kMultiply")? this.multiply([operand1, operand2]): 
                this.divide(operand1, operand2);
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

const secondaryOperations = {
    clear: function() {
        displayDiv.textContent = "";
        displayFunctions.storedOperand = "";
        storedOperation = "";
    },
};












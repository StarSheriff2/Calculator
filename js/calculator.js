const displayDiv = document.querySelector("#displayDiv");
const displayStyle = displayDiv.style;
const allButtons = document.querySelectorAll("#keysDiv div");
const keys = document.querySelector("#keysDiv");
const buttonsArray = Array.from(allButtons);
const body = document.querySelector("body");

window.addEventListener("load", _ => keys.focus());

body.addEventListener("mouseleave", _ => keys.blur());

body.addEventListener("mouseenter", _ => keys.focus());

document.addEventListener("click", _ => keys.focus());

addEventListener("keydown", parseInput);

buttonsArray.forEach(btn => {
    btn.addEventListener("click", parseInput);
    btn.addEventListener("mousedown", applyShadow);
    btn.addEventListener("mouseup", restoreClass);
});

function parseInput(e) {
    if (e.type === "click") {
        if (e.target.id == "k+/-") return;
        this["keyId"] = document.querySelector(`#${e.target.id}`);
    }
    else {
        if (document.activeElement === keys && e.keyCode === 8 || e.key === "/") e.preventDefault();
        this["keyId"] = document.querySelector(`#keysDiv div[data-key="${e.key}"]`);
    }
    if (!this.keyId) return;
    redirectClick(this.keyId);
}

function applyShadow(e) {
    if (e.target.id == "k+/-") return;
    this["keyId"] = document.querySelector(`#${e.target.id}`);
    this.keyId.classList.add("buttonClick");
}

function restoreClass(e) {
    if (e.target.id == "k+/-") return;
    this["keyId"] = document.querySelector(`#${e.target.id}`);
    this.keyId.removeAttribute("class", "buttonClick");
}

function redirectClick(button) {
    switch(true) {
        case (button.className == "numberbtn"):
            onClickFunctions.number(button);
            break;
        case button.className == "operatorBtn":
            console.log(button.id);
            onClickFunctions.operator(button);
            break;
        case button.id == "kBackspace":
            console.log(button.id);
            onClickFunctions.backspace();
            break;
        case button.id == "kC":   
            onClickFunctions.clear();
            break;
        case button.id == "kEquals":
            onClickFunctions.equals();
            break;
        case button.id == "kDot":
            onClickFunctions.number(button);
            break;
    }
}

const onClickFunctions = {
    number: function(button) {
        if ("equalsResult" in this) {
            delete this.equalsResult;
            delete this.storedOperation;
            delete displayFunctions.currentOperand;
        }
        displayFunctions.display(button.id);
    },
    operator: function(button) { 
                if ("storedOperation" in this && "currentOperand" in displayFunctions && !("equalsResult" in this)) {
                    displayDiv.textContent = mathOperations.operate(this.storedOperation[0], this.storedOperation[1], displayFunctions.currentOperand);
                    this.storedOperation = [(displayDiv.textContent === "invalid operation" || displayDiv.textContent === "ERROR")? 
                    displayDiv.textContent: displayDiv.textContent.replace(/,/g, "")*1, button.id];
                    delete displayFunctions.currentOperand;
                }
                else if ("currentOperand" in displayFunctions && !("equalsResult" in this)) {
                    this["storedOperation"] = [displayFunctions.currentOperand, button.id];
                    delete displayFunctions.currentOperand;
                }
                else if ("storedOperation" in this) { 
                    this.storedOperation = [("equalsResult" in this)? this.equalsResult: this.storedOperation[0], button.id];
                    if ("currentOperand" in displayFunctions) delete displayFunctions.currentOperand;
                    if ("equalsResult" in this) delete this.equalsResult;
                }
                else {
                    this["storedOperation"] = [0, button.id];
                }
    },
    backspace: function() {
        secondaryOperations.backspace();
    },
    clear: function() {
        secondaryOperations.clear();
    },
    equals: function() {
        if ("storedOperation" in this && !("equalsResult" in this)) {
            displayDiv.textContent = mathOperations.operate(this.storedOperation[0], 
                this.storedOperation[1], ("currentOperand" in displayFunctions)? displayFunctions.currentOperand: this.storedOperation[0]);
            console.log(mathOperations.operate(this.storedOperation[0], 
                this.storedOperation[1], ("currentOperand" in displayFunctions)? displayFunctions.currentOperand: this.storedOperation[0]));
            this["equalsResult"] = (displayDiv.textContent === "invalid operation" || displayDiv.textContent === "ERROR")? 
                displayDiv.textContent: displayDiv.textContent.replace(/,/g, "")*1;
        }
        else if ("equalsResult" in this) {
            displayDiv.textContent = mathOperations.operate(this.equalsResult, 
                this.storedOperation[1], ("currentOperand" in displayFunctions)? displayFunctions.currentOperand: this.storedOperation[0]);
            if (displayDiv.textContent === "invalid operation" || displayDiv.textContent === "ERROR") {
                this.equalsResult = displayDiv.textContent;
            }
            else {
                this.equalsResult = displayDiv.textContent.replace(/,/g, "")*1;
            }
        }
        else {
            return;
        }
    },
};

const displayFunctions = {
    display: function(key) {
        if (displayDiv.textContent === "0" || !("currentOperand" in displayFunctions)) { 
            displayDiv.textContent = (key == "kDot")? "0.": `${document.querySelector(`#${key}`).textContent}`;
        }
        else if (this.currentOperand.toString().length > 13 || key == "kDot" && displayDiv.textContent.indexOf(".") >= 0) {
            return;
        }
        else { 
            this["rawDisplayContent"] = displayDiv.textContent.replace(/,/g, "") + `${document.querySelector(`#${key}`).textContent}`;
            displayDiv.textContent = this.rawDisplayContent.replace(/(?<!(?<=\.)(\d)*)\d(?=(\d{3})+(?!\d))/g, "$&,");
            delete this.rawDisplayContent;
        }
        this["currentOperand"] = Number(displayDiv.textContent.replace(/,/g, ""));
        console.log(this.currentOperand);
        console.log(key);
    },
};

const mathOperations = {
    operate: function(operand1, operator, operand2) {
        let result;
        if (onClickFunctions.storedOperation[0] === "invalid operation" || onClickFunctions.storedOperation[0] === "ERROR") {
            return "ERROR";
        }
        else {
            result = 
                (operator == "kAdd")? this.add(operand1, operand2): 
                (operator == "kSubtract")? this.subtract(operand1, operand2):
                (operator == "kMultiply")? this.multiply([operand1, operand2]): 
                this.divide(operand1, operand2);
        }
        return  (result.toString().length > 14 && typeof(result) === "number" || result.toString().indexOf("e+") >= 0 || result.toString().indexOf("e-") >= 0)? result.toExponential(9):
                result.toString().replace(/(?<!(?<=\.)(\d)*)\d(?=(\d{3})+(?!\d))/g, "$&,");
    },
    add: function(addend, addend2) {
        return (addend + addend2);
    },
    subtract: function(minuend, subtrahend) {
        return minuend - subtrahend;
    },
    multiply: function(array) {
        return array.reduce((product, multiplier) => product * multiplier);
    },
    divide: function(dividend, divisor) {
        return (divisor === 0 || divisor === "")? "invalid operation": dividend/divisor;
    },
};

const secondaryOperations = {
    clear: function() {
        displayDiv.textContent = "0";
        delete displayFunctions.currentOperand;
        delete onClickFunctions.storedOperation;
        delete onClickFunctions.equalsResult;
    },
    backspace: function() {
        if ("currentOperand" in displayFunctions && !("equalsResult" in onClickFunctions)) {
            displayDiv.textContent = displayDiv.textContent.slice(0, displayDiv.textContent.length - 1);
            if (displayDiv.textContent === "") {
                displayDiv.textContent = "0";
                delete displayFunctions.currentOperand;
            }
            else {
                displayFunctions.currentOperand = displayDiv.textContent*1;
            }    
        }
        else return;
    },
};
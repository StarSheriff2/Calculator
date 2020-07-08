const displayDiv = document.querySelector("#displayDiv");
const displayStyle = displayDiv.style;
const allButtons = document.querySelectorAll("#keysDiv div");
const keys = document.querySelector("#keysDiv");
const buttonsArray = (allButtons);
const body = document.querySelector("body");

const userInput = {
    parseInput: function(e) {
        if (e.type === "mousedown") {
            if (e.target.id == "k+/-") return; // this is the +/- that will be implemented later
            userInput["keyId"] = document.querySelector(`#${e.target.id}`);
        }
        else {
            if (e.key === '"' || e.metaKey) {
                return;
            }
            if (document.querySelector(`#keysDiv div[data-key="${e.key}"]`)) {
                e.preventDefault();
                userInput["keyId"] = document.querySelector(`#keysDiv div[data-key="${e.key}"]`);
            }
            else {
                return;
            }
        }
        redirectClick(userInput.keyId);
        userInput.keyId.classList.add("buttonClick");
        userInput["keyDownKeyCode"] = e.keyCode;
    },
    restoreClass: function(e) {
        if (e.type === "mouseup") {
            if (!("keyId" in userInput) || !userInput.keyId ) {
                delete userInput.keyId;
                return;
            }
            userInput.keyId.classList.remove("buttonClick");
            delete userInput.keyId;
            return;
        } else {
            if (e.key === '"') {        // this is the +/-
                delete userInput.keyId; // button that will
                delete userInput.keyDownKeyCode;
                return;                 // be implemented
            }                           // later
            if (e.keyCode === userInput.keyDownKeyCode) {
                userInput.keyId.classList.remove("buttonClick");
            }
            else if (document.querySelector(`#keysDiv div[data-key="${e.key}"]`)) {
                document.querySelector(`#keysDiv div[data-key="${e.key}"]`).classList.remove("buttonClick");
                if (e.keyCode === 55 || e.keyCode === 171 || e.keyCode === 187) {
                    document.querySelector(`#keysDiv div[data-key="${((e.keyCode === 55)? '/': '*')}"]`).classList.remove("buttonClick");
                }
            }
            else if (document.querySelector(`#keysDiv div[data-key="${String.fromCharCode(e.keyCode)}"]`)) {
                document.querySelector(`#keysDiv div[data-key="${String.fromCharCode(e.keyCode)}"]`).classList.remove("buttonClick");
            }
            else {
                return;
            }
            delete userInput.keyId;
            delete userInput.keyDownKeyCode;
            return;
        }
    },
};

addEventListener("keydown", userInput.parseInput);

addEventListener("keyup", userInput.restoreClass);

buttonsArray.forEach(btn => btn.addEventListener("mousedown", userInput.parseInput));

window.addEventListener("mouseup", userInput.restoreClass);

function redirectClick(button) {
    switch(true) {
        case (button.className == "numberbtn"):
            onClickFunctions.number(button);
            break;
        case button.className == "operatorBtn":
            onClickFunctions.operator(button);
            break;
        case button.id == "kBackspace":
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
        console.log(onClickFunctions.storedOperation);
    },
    operator: function(button) { 
        if (!(button.classList.contains("operatorClick"))) {
            if ("storedOperation" in onClickFunctions) {
                document.querySelector(`#${this.storedOperation[1]}`).classList.remove("operatorClick");
            }
            button.classList.add("operatorClick");
        }  
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
        console.log(onClickFunctions.storedOperation);
    },
    clear: function() {
        secondaryOperations.clear();
        console.log(onClickFunctions.storedOperation);
    },
    equals: function() {
        if ("storedOperation" in onClickFunctions) {
            document.querySelector(`#${this.storedOperation[1]}`).classList.remove("operatorClick");
        };  
        if ("storedOperation" in this && !("equalsResult" in this)) {
            displayDiv.textContent = mathOperations.operate(this.storedOperation[0], 
                this.storedOperation[1], ("currentOperand" in displayFunctions)? displayFunctions.currentOperand: this.storedOperation[0]);
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
            console.log(onClickFunctions.storedOperation);
            return;
        }
        console.log(onClickFunctions.storedOperation);
    },
};

const displayFunctions = {
    display: function(key) {
        if (displayDiv.textContent === "0" || !("currentOperand" in displayFunctions)) { 
            displayDiv.textContent = (key == "kDot")? "0.": `${document.querySelector(`#${key}`).textContent}`;
        }
        else if (displayDiv.textContent.replace(/,/g, "").length > 11 || key == "kDot" && displayDiv.textContent.indexOf(".") >= 0) {
            return;
        }
        else { 
            this["rawDisplayContent"] = displayDiv.textContent.replace(/,/g, "") + `${document.querySelector(`#${key}`).textContent}`;
            displayDiv.textContent = this.addCommas(this.rawDisplayContent);
            delete this.rawDisplayContent;
        }
        this["currentOperand"] = Number(displayDiv.textContent.replace(/,/g, ""));
        if ("storedOperation" in onClickFunctions && document.querySelector(`#${onClickFunctions.storedOperation[1]}`)) {
            document.querySelector(`#${onClickFunctions.storedOperation[1]}`).classList.remove("operatorClick");
        };  
    },
    addCommas: function(num) {
        if (num.indexOf(".") >= 0) {
            let integer = num.substr(0, num.indexOf("."));
            integer = integer.replace(/\d(?=(\d{3})+(?!\d))/g, "$&,");
            let decimal = num.substr(num.indexOf("."));
            return integer.concat(decimal);
        }
        else {
            num = num.replace(/\d(?=(\d{3})+(?!\d))/g, "$&,");
            return num;
        }
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
        return  (result.toString().length > 11 && typeof(result) === "number" || result.toString().indexOf("e+") >= 0 || result.toString().indexOf("e-") >= 0)? result.toExponential(6):
                displayFunctions.addCommas(result.toString());
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
        if ("storedOperation" in onClickFunctions) {
            document.querySelector(`#${this.storedOperation[1]}`).classList.remove("operatorClick");
        }    
    },
    backspace: function() {
        if ("storedOperation" in onClickFunctions) {
            document.querySelector(`#${this.storedOperation[1]}`).classList.remove("operatorClick");
        }
        if ("currentOperand" in displayFunctions && !("equalsResult" in onClickFunctions)) {
            let modifiedDisplayValue = displayDiv.textContent.replace(/,/g, "");
            modifiedDisplayValue = modifiedDisplayValue.slice(0, modifiedDisplayValue.length - 1);
            displayDiv.textContent = displayFunctions.addCommas(modifiedDisplayValue);
            if (displayDiv.textContent === "") {
                displayDiv.textContent = "0";
                delete displayFunctions.currentOperand;
            }
            else {
                displayFunctions.currentOperand = Number(displayDiv.textContent.replace(/,/g, ""));
            }    
        }
        else return;
    },
};
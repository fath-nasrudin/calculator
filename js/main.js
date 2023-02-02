const display = {
  value: 0,
}
const getDisplayValue = () => document.querySelector('#display').textContent;
const setDisplayValue = (value) => document.querySelector('#display').textContent = value;
const clearDisplayValue = () => setDisplayValue(display.value);
const updateDisplayValue = (value) => {
  let displayValue = getDisplayValue();
  const arrDisplayValue = transformInputIntoArray(displayValue);
  const lastElement = arrDisplayValue[arrDisplayValue.length - 1];
  const secondLastElement = arrDisplayValue[arrDisplayValue.length - 2];
  const isDoubleOperator = (checkOperator(lastElement) && checkOperator(secondLastElement))

  // no multiple dot and add zero if no number before the dot
  if (checkOperator(lastElement) && value === '.') value = `0${value}`;
  if( value === '.' && !checkOperator(lastElement) && lastElement.includes('.')) {
    return;
  }

  // no double operator except for minus
  if (isDoubleOperator && checkOperator(value)) {
    return;
  }
  if (checkOperator(value) && checkOperator(displayValue[displayValue.length - 1]) && value !== '-')  {
    displayValue = displayValue.slice(0, -1);
  }

  let newDisplayValue = `${displayValue}${value}`;
  
  // setting for first char
  // if char is number or "-" char
  if (
    displayValue.length == 1 && 
    displayValue == '0' && 
    (!isNaN(value) || value === '-')) {
      newDisplayValue = value;
  }

  setDisplayValue(newDisplayValue);
}

const doBackspace = () => {
  const displayValue = getDisplayValue();

  if (displayValue.length === 1) {
   if (displayValue[0] === '0') return;
   setDisplayValue(0);
   return;
  }
  setDisplayValue(displayValue.slice(0, -1));
}

const doCalculate = () => {
  let displayValue = getDisplayValue();

  // remove last operator
  if (checkOperator(displayValue[displayValue.length - 1])) {
    displayValue = displayValue.slice(0, -1);
  }

  // do calculation
  const result = calculate(displayValue);
  const roundedResult = Math.ceil(result * 100) / 100
  setDisplayValue(roundedResult);
}
const checkOperator = (char) => {
  const operator = ['/', '*', '-', '+'];
  return operator.includes(char);
}


// setup buttons
const numberAndOperatorButtons = document.querySelectorAll('.numb,.operator');
Array.from(numberAndOperatorButtons).forEach(button => {
  button.addEventListener('click', (e) => {
    // console.log(e.target.textContent)
    updateDisplayValue(e.target.textContent)
  })
})

const clearButton = document.querySelector('#clear');
clearButton.addEventListener('click', clearDisplayValue);

const backspaceButton = document.querySelector('#back');
backspaceButton.addEventListener('click', doBackspace);

const equalButton = document.querySelector('#equal');
equalButton.addEventListener('click', doCalculate);


// calculations
const add = (a,b) => a+b;
const substract = (a,b) => a-b;
const multiply = (a,b) => a*b;
const divide = (a,b) => a/b;
const operate = (operator, firstNumber, secondNumber) => {
  if (operator === '+') return add(firstNumber, secondNumber);
  if (operator === '-') return substract(firstNumber, secondNumber);
  if (operator === '*') return multiply(firstNumber, secondNumber);
  if (operator === '/') return divide(firstNumber, secondNumber);
}
const transformInputIntoArray = (inputString) => {
  const regex = /(?=[/*+-])|(?<=[/*+-])/g
  return inputString.split(regex);
}
const calculate = (arr) => {
  
  if (typeof arr === 'string') {
    arr = transformInputIntoArray(arr);
  }

  const newArr = [...arr];
  let total = 0;
  let firstNumber = (newArr.shift());
  let operator = null;
  let secondNumber = 0;

  do {
    if (firstNumber === '-') firstNumber = firstNumber + newArr.shift(); // treat the minus
    if (newArr.length === 0) return Number(firstNumber); 
    operator = newArr.shift();
    secondNumber = newArr.shift();
    if (secondNumber === '-') secondNumber = secondNumber + newArr.shift();  // treat the minus

    total = operate(operator, Number(firstNumber), Number(secondNumber));
    firstNumber = total;
  } while (newArr.length !== 0);
  return total;
}

// On First Load
setDisplayValue(display.value);
document.querySelector('.year-display').textContent = new Date().getFullYear();


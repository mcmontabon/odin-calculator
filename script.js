// Basic math functions
function add(a, b) {
	return a + b;
}
function subtract(a, b) {
	return a - b;
}
function multiply(a, b) {
	return a * b;
}
function divide(a, b) {
	if (b === 0) return 'Nice try!';
	return a / b;
}

// Operate function
function operate(operator, a, b) {
	a = Number(a);
	b = Number(b);
	switch (operator) {
		case '+':
			return add(a, b);
		case '-':
			return subtract(a, b);
		case '*':
			return multiply(a, b);
		case '/':
			return divide(a, b);
		default:
			return null;
	}
}

// Variables for state
let firstNum = '';
let secondNum = '';
let currentOp = null;
let shouldResetDisplay = false;

const display = document.getElementById('display');
const digitButtons = document.querySelectorAll('.digit');
const operatorButtons = document.querySelectorAll('.operator');
const equalsButton = document.getElementById('equals');
const clearButton = document.getElementById('clear');
const decimalButton = document.getElementById('decimal');
const backspaceButton = document.getElementById('backspace');

// Display functions
function appendNumber(number) {
	// Prevent adding more than 15 digits
	if (display.textContent.replace('.', '').length >= 15 && !shouldResetDisplay)
		return;
	if (display.textContent === '0' || shouldResetDisplay) {
		updateDisplay(number);
		shouldResetDisplay = false;
	} else {
		updateDisplay(display.textContent + number);
	}
}

function updateDisplay(value) {
	// Limit display to 15 characters (including decimal point)
	if (value.length > 15) value = value.slice(0, 15);
	display.textContent = value;
	decimalButton.disabled = display.textContent.includes('.');
}

function appendDecimal() {
	if (shouldResetDisplay) updateDisplay('0');
	if (!display.textContent.includes('.')) {
		updateDisplay(display.textContent + '.');
		shouldResetDisplay = false;
	}
}

function clear() {
	firstNum = '';
	secondNum = '';
	currentOp = null;
	shouldResetDisplay = false;
	updateDisplay('0');
}

function setOperation(operator) {
	if (currentOp !== null) evaluate();
	firstNum = display.textContent;
	currentOp = operator;
	shouldResetDisplay = true;
}

function evaluate() {
	if (currentOp === null || shouldResetDisplay) return;
	if (currentOp === '/' && display.textContent === '0') {
		updateDisplay('Nice try!');
		firstNum = '';
		currentOp = null;
		shouldResetDisplay = true;
		return;
	}
	secondNum = display.textContent;
	let result = operate(currentOp, firstNum, secondNum);
	if (typeof result === 'number') result = Math.round(result * 1000) / 1000;
	updateDisplay(result);
	firstNum = result;
	currentOp = null;
	shouldResetDisplay = true;
}

// Event listeners
digitButtons.forEach((btn) =>
	btn.addEventListener('click', () => appendNumber(btn.textContent))
);

operatorButtons.forEach((btn) =>
	btn.addEventListener('click', () => setOperation(btn.dataset.op))
);

equalsButton.addEventListener('click', evaluate);
clearButton.addEventListener('click', clear);
decimalButton.addEventListener('click', appendDecimal);
backspaceButton.addEventListener('click', () => {
	if (shouldResetDisplay) return;
	updateDisplay(display.textContent.slice(0, -1) || '0');
});

// Initialize
clear();

function appendDecimal() {
	if (shouldResetDisplay) {
		updateDisplay('0');
		shouldResetDisplay = false;
	}
	if (!display.textContent.includes('.')) {
		updateDisplay(display.textContent + '.');
	}
	// Disable decimal button if already present
	decimalButton.disabled = display.textContent.includes('.');
}

// Enable/disable decimal button on display update
function updateDisplay(value) {
	display.textContent = value;
	decimalButton.disabled = display.textContent.includes('.');
}

// ...existing code...

backspaceButton.addEventListener('click', () => {
	if (shouldResetDisplay) return;
	updateDisplay(display.textContent.slice(0, -1) || '0');
});

// Keyboard support
document.addEventListener('keydown', (e) => {
	if (e.key >= '0' && e.key <= '9') {
		appendNumber(e.key);
	}
	if (['+', '-', '*', '/'].includes(e.key)) {
		setOperation(e.key);
	}
	if (e.key === 'Enter' || e.key === '=') {
		evaluate();
	}
	if (e.key === 'Backspace') {
		backspaceButton.click();
	}
	if (e.key === 'Escape') {
		clear();
	}
	if (e.key === '.') {
		appendDecimal();
	}
});

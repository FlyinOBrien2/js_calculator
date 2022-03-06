const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator_keys');
const output = calculator.querySelector('.calculator_display');

// const displayedNum = output.textContent;
const clearButton = document.getElementById('clear-button');

const OPERATOR = 'operator';
const NUMBER = 'number';
const DECIMAL = 'decimal';
const CALCULATE = 'calculate';


function calculate(val1, oper, val2) {
	val1 = parseFloat(val1);
	val2 = parseFloat(val2);
	switch (oper) {
		case 'add':
			return val1 + val2;
		case 'subtract':
			return val1 - val2;
		case 'multiply':
			return val1 * val2;
		case 'divide':
			return val1 / val2;
	}
}

function createResultString(key) {
	const value = key.target.value;
	const displayedNum = output.textContent;
	const previousKeyType = calculator.dataset.previousKeyType;
	const action = calculator.action;
	if (!action) {
		return (
			displayedNum === 0 ||
			previousKeyType === OPERATOR ||
			previousKeyType === CALCULATE
		)
			? value
			: value + displayedNum
	}
	if (action === DECIMAL) {
		if (!displayedNum.includes('.')) {
			return displayedNum + '.';
		}
		if (previousKeyType === OPERATOR || previousKeyType === CALCULATE) {
			return '0.'
		}
		return displayedNum;
	}
	// lse if (action === 'decimal' && !output.textContent.includes('.')) {
	// 	if (previousKeyType === 'operator') {
	// 		output.textContent = '0'
	// 	}
	// 	output.textContent += '.'
	// 	calculator.dataset.previousKeyType = DECIMAL;
	// 
	return value
} // end createResultString

keys.addEventListener('click', e => {
	const key = e.target;
	const previousKeyType = calculator.dataset.previousKeyType;
	const action = key.dataset.action;
	// const displayedNum = output.textContent;

	if (action !== 'clear') {
		clearButton.textContent = 'CE';
	}

	key.classList.remove('is-depressed')

	Array.from(key.parentNode.children)
		.forEach(k => k.classList.remove('is-depressed'));

	if (key.matches('button')) {
		// if no data-action attribute, it must be a number
		if (!action) {
			const value = key.textContent;
			if (displayedNum === '0' || previousKeyType === OPERATOR || previousKeyType === CALCULATE) {
				output.textContent = value;
			} else {
				output.textContent = displayedNum + value;
			}
			calculator.dataset.previousKeyType = NUMBER;
		}
		// if there is a data-action attribute, handle +-*/
		else if (
			action === 'add' ||
			action === 'subtract' ||
			action === 'multiply' ||
			action === 'divide'
		) {
			if (previousKeyType !== CALCULATE) {

				const firstValue = calculator.dataset.firstValue;
				const operator = calculator.dataset.operator;
				const secondValue = displayedNum;



				if (firstValue && operator && previousKeyType !== OPERATOR) {
					output.textContent = calculate(firstValue, operator, secondValue);
					calculator.dataset.firstValue = output.textContent;
				} else {
					calculator.dataset.firstValue = displayedNum;
				}

				// handle if an operator is clicked before any numbers are entered
				key.classList.add('is-depressed')
				if (displayedNum === '0') {
					setTimeout(() => { key.classList.remove('is-depressed') }, 100)
				}

				calculator.dataset.operator = action;
				calculator.dataset.previousKeyType = OPERATOR;
			}

			// handle the calculate button
		} else if (action === 'calculate') {
			let firstValue = calculator.dataset.firstValue;
			const operator = calculator.dataset.operator;
			secondValue = displayedNum;

			if (firstValue) {
				if (previousKeyType === CALCULATE) {
					firstValue = displayedNum;
					secondValue = calculator.dataset.modValue;
				} else {
					const result = calculate(firstValue, operator, secondValue);
					output.textContent = result;
					calculator.dataset.modValue = secondValue;
				}
			}
			calculator.dataset.previousKeyType = CALCULATE;

			// handle if the decimal button is clicked
		} else if (action === 'decimal' && !output.textContent.includes('.')) {
			if (previousKeyType === 'operator') {
				output.textContent = '0'
			}
			output.textContent += '.'
			calculator.dataset.previousKeyType = DECIMAL;
		}

		// handle if the clear button is clicked
		else if (action === 'clear') {
			const ds = calculator.dataset;
			console.log('action = clear', action)
			console.log(clearButton.textContent)
			if (clearButton.textContent === 'AC') {
				console.log('text = ac')
				ds.firstValue = '';
				ds.modValue = '';
				ds.operator = '';
				ds.previousKeyType = '';
			} else {
				clearButton.textContent = 'AC';
			}
			output.textContent = '0';
			calculator.dataset.previousKeyType = 'clear';
		}
	}
	console.log(calculator.dataset)
}) // end eventListener
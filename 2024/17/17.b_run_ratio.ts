const program = [2, 4, 1, 3, 7, 5, 1, 5, 0, 3, 4, 2, 5, 5, 3, 0]

let output: number[] = []
let lastOutput: number[] = []

const runProgram = (a: number) => {
	output.length = 0

	while (true) {
		const b = (a & 0b111) ^ 0b011

		output.push((b ^ 0b101 ^ (a >> b)) & 0b111)

		a = a >> 3

		if (a === 0) {
			break
		}
	}
}

const digitRunLength: number[] = Array(program.length).fill(1)
const minDigitRunLength: number[] = Array(program.length).fill(Infinity)
const minRunRatio: number[] = Array(program.length).fill(Infinity)

for (let i = 1; ; i++) {
	runProgram(i)

	if (output.length > program.length) {
		console.log("output.length > program.length")
		console.log(output, i)
		break
	}

	// how long are runs of digits at least, until they either change or a higher digit changes?
	let prevDigitChanged = false
	let prevDigitRunLength = NaN
	for (let j = output.length - 1; j >= 0; j--) {
		const currentDigit = output[j]
		const lastDigit = lastOutput[j]

		if (prevDigitChanged || currentDigit !== lastDigit) {
			if (currentDigit !== undefined && lastDigit !== undefined) {
				const ownRunLength = digitRunLength[j] as number
				minDigitRunLength[j] = Math.min(
					minDigitRunLength[j] as number,
					ownRunLength
				)
				if (prevDigitChanged && !isNaN(prevDigitRunLength)) {
					const runLengthRatio = ownRunLength / prevDigitRunLength
					minRunRatio[j] = Math.min(minRunRatio[j] as number, runLengthRatio)
				}
				prevDigitRunLength = ownRunLength
				digitRunLength[j] = 1
			}
			prevDigitChanged = true
		} else {
			;(digitRunLength[j] as number)++
		}
	}

	const temp = lastOutput
	lastOutput = output
	output = temp

	if (i % 1000000 === 0) {
		console.log(`${i}: ${output.join("")}`)
		console.log(`${minRunRatio.join(" ")}`)
		console.log(`${minDigitRunLength.join(" ")}`)
	}

	// if (output.length === program.length && output.every((n, j) => n === program[j])) {
	// 	console.log(i)
	// 	break
	// }
}

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

const digitChangeCounters: number[] = Array(program.length).fill(0)
const maxDigitChangeCounters: number[] = Array(program.length).fill(0)

for (let i = 1; ; i++) {
	runProgram(i)

	if (output.length > program.length) {
		console.log("output.length > program.length")
		console.log(output, i)
		break
	}

	// how many times does the ith digit change compared to the last output at most before the i+1th digit changes?
	let prevDigitChanged = false
	for (let j = output.length; j >= 0; j--) {
		if (prevDigitChanged) {
			maxDigitChangeCounters[j] = Math.max(
				maxDigitChangeCounters[j] as number,
				digitChangeCounters[j] as number
			)
			digitChangeCounters[j] = 0
			continue
		}

		const currentDigit = output[j]
		const lastDigit = lastOutput[j]

		if (currentDigit !== lastDigit) {
			;(digitChangeCounters[j] as number)++
			prevDigitChanged = true
		}
	}

	const temp = lastOutput
	lastOutput = output
	output = temp

	if (i % 100000 === 0) {
		console.log(`${i}: ${output.join("")}`)
		console.log(`${maxDigitChangeCounters.join(" ")}`)
	}

	// if (output.length === program.length && output.every((n, j) => n === program[j])) {
	// 	console.log(i)
	// 	break
	// }
}

import fs from "fs"
import path from "path"
const [, bRaw, cRaw, , programRaw] = fs
	.readFileSync(
		path.join(
			__dirname,
			`input_${path.basename(process.argv[1] || "").split(".")[0]}`
		)
	)
	.toString()
	.trim()
	.split("\n")

const initialB = 0
const initialC = 0
const program = [2, 4, 1, 3, 7, 5, 1, 5, 0, 3, 4, 2, 5, 5, 3, 0]

let a = 0,
	b = 0,
	c = 0
let instructionPointer = 0
const output: number[] = []

const readComboOperand = (n: number) => {
	switch (n) {
		case 0:
		case 1:
		case 2:
		case 3:
			return n
		case 4:
			return a
		case 5:
			return b
		case 6:
			return c
		default:
			throw new Error(`Invalid combo operand ${n}`)
	}
}

const runDivInstruction = (operand: number, write: (n: number) => void) => {
	write(Math.trunc(a / Math.pow(2, readComboOperand(operand))))
}

const runXorInstruction = (
	operandA: number,
	operandB: number,
	write: (n: number) => void
) => {
	write(operandA ^ operandB)
}

const interpretProgram = (initialA: number) => {
	a = initialA
	b = initialB
	c = initialC
	instructionPointer = 0
	output.length = 0

	while (true) {
		if (instructionPointer >= program.length) {
			break
		}

		const opcode = program[instructionPointer] as number
		const operand = program[instructionPointer + 1] as number

		switch (opcode) {
			case 0: // adv
				runDivInstruction(operand, n => (a = n))
				break
			case 1: // bxl
				runXorInstruction(b, operand, n => (b = n))
				break
			case 2: // bst
				b = readComboOperand(operand) & 0b111
				break
			case 3: // jnz
				if (a !== 0) {
					instructionPointer = operand
					continue // Skip the instruction pointer increment
				}
				break
			case 4: // bxc
				runXorInstruction(b, c, n => (b = n))
				break
			case 5: // out
				output.push(readComboOperand(operand) & 0b111)
				break
			case 6: // bdv
				runDivInstruction(operand, n => (b = n))
				break
			case 7: // cdv
				runDivInstruction(operand, n => (c = n))
				break
			default:
				throw new Error(`Invalid opcode ${opcode}`)
		}

		instructionPointer += 2
	}
}

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

for (let i = 1; ; i++) {
	interpretProgram(i)
	const output1 = output.join("")
	runProgram(i)
	const output2 = output.join("")
	if (output1 !== output2) {
		console.log(`Found a mismatch for ${i}: ${output1} vs ${output2}`)
		break
	}
	console.log(`${i}: ${output1}`)

	// if (output.length === program.length && output.every((n, j) => n === program[j])) {
	// 	console.log(i)
	// 	break
	// }
}

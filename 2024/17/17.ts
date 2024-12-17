import fs from "fs"
import path from "path"
const [aRaw, bRaw, cRaw, , programRaw] = fs
	.readFileSync(
		path.join(
			__dirname,
			`input_${path.basename(process.argv[1] || "").split(".")[0]}`
		)
	)
	.toString()
	.trim()
	.split("\n")

let a = parseInt((aRaw as string).split(" ").pop() as string, 10)
let b = parseInt((bRaw as string).split(" ").pop() as string, 10)
let c = parseInt((cRaw as string).split(" ").pop() as string, 10)
const program = ((programRaw as string).split(":").pop() as string)
	.split(",")
	.map(x => parseInt(x, 10))
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

console.log(`Output: ${output.join("")}`)
console.log(`Output: ${output.join(",")}`)
console.log(`Instruction Pointer: ${instructionPointer}`)
console.log(`Register A: ${a}`)
console.log(`Register B: ${b}`)
console.log(`Register C: ${c}`)

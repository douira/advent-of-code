import fs from "fs"
import path from "path"
const [initialStates, gatesRaw] = fs
	.readFileSync(
		path.join(
			__dirname,
			`input_${path.basename(process.argv[1] || "").split(".")[0]}`
		)
	)
	.toString()
	.trim()
	.split("\n\n") as [string, string]

const states = new Map<string, boolean>()
initialStates.split("\n").map((row) => {
	const [name, value] = row.split(": ") as [string, string]
	states.set(name, value === "1")
})

type GateType = "AND" | "OR" | "XOR"
type Gate = {
	type: GateType
	inputA: string
	inputB: string
	output: string
}
const gates = new Map<string, Gate>()

gatesRaw.split("\n").map((row) => {
	const [input, output] = row.split(" -> ") as [string, string]
	const [inputA, type, inputB] = input.split(" ") as [string, GateType, string]
	gates.set(output, {
		type,
		inputA,
		inputB,
		output,
	})
})

const getValue = (input: string): boolean | undefined => {
	if (!states.has(input)) {
		const gate = gates.get(input)
		if (!gate) {
			return undefined
		}
		const valueA = getValue(gate.inputA)
		const valueB = getValue(gate.inputB)
		if (valueA === undefined || valueB === undefined) {
			throw new Error("Invalid input")
		}
		switch (gate.type) {
			case "AND":
				states.set(input, valueA && valueB)
				break
			case "OR":
				states.set(input, valueA || valueB)
				break
			case "XOR":
				states.set(input, valueA !== valueB)
				break
		}
	}
	return states.get(input)
}

let result = 0n
for (let i = 0; ; i++) {
	const digit = getValue(`z${i.toString().padStart(2, "0")}`)
	if (digit) {
		result |= 1n << BigInt(i)
	}
	if (digit === undefined) {
		break
	}
}

console.log(result)

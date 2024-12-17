let output: bigint[] = []
let outputNormal: number[] = []

const runProgram = (a: bigint) => {
	output = []

	while (true) {
		const b = (a & 7n) ^ 3n

		output.push((b ^ 5n ^ (a >> b)) & 7n)

		a = a >> 3n

		if (a === 0n) {
			break
		}
	}
}

const runProgramNormal = (a: number) => {
	outputNormal.length = 0

	while (true) {
		const b = (a & 0b111) ^ 0b011

		outputNormal.push((b ^ 0b101 ^ (a >> b)) & 0b111)

		a = a >> 3

		if (a === 0) {
			break
		}
	}
}

for (let i = 0; ; i++) {
	runProgram(BigInt(i))

	runProgramNormal(i)

	// check if same output
	if (output.length === outputNormal.length && output.every((v, i) => v === BigInt(outputNormal[i] as number))) {
		console.log(`Same output for ${i}`)
	} else {
		console.log(`Different output for ${i}`)
		break
	}
}

const target = [2, 4, 1, 3, 7, 5, 1, 5, 0, 3, 4, 2, 5, 5, 3, 0]
const bigIntTarget = target.map(n => BigInt(n))

let output: bigint[] = []

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

const search = (digitIndex: number = target.length - 1, value: bigint = 0n): bigint | null => {
	if (digitIndex < 0) {
		return value
	}
	const targetDigit = bigIntTarget[digitIndex] as bigint
	for (let test = 0n; test < 8n; test++) {
		const shifted = test << BigInt(digitIndex * 3)
		const runValue = value | shifted
		runProgram(runValue)
		if (output[digitIndex] === targetDigit) {
			const result = search(digitIndex - 1, runValue)
			if (result !== null) {
				return result
			}
		}
	}
	return null
}

let value = search()
if (value === null) {
	throw new Error("No value found")
}
runProgram(value)

if (
	output.length === target.length &&
	output.every((v, i) => v === bigIntTarget[i])
) {
	console.log("Success")
}
console.log(`output: ${output.join("")}`)
console.log(`target: ${bigIntTarget.join("")}`)
console.log(`value: ${value}`)

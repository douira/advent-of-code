import fs from "fs"
import path from "path"
const input = fs
	.readFileSync(
		path.join(
			__dirname,
			`input_${path.basename(process.argv[1] || "").split(".")[0]}`
		)
	)
	.toString()
	.trim()
	.split("\n")

const left: number[] = []
const right: Map<number, number> = new Map()
input
	.map(line => line.split(/\s+/).map(n => parseInt(n, 10)))
	.forEach(([a, b]) => {
		left.push(a)
		right.set(b, (right.get(b) ?? 0) + 1)
	})

let sum = 0
for (let i = 0; i < left.length; i++) {
	const a = left[i]
	const b = right.get(a) ?? 0
	sum += a * b
}

console.log(sum)

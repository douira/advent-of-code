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

const pairs: [number[], number[]] = [[], []]
input
	.map(line => line.split(/\s+/).map(n => parseInt(n, 10)))
	.forEach(([a, b]) => {
		pairs[0].push(a)
		pairs[1].push(b)
	})

pairs.forEach(list => list.sort((a, b) => a - b))
let diffSum = 0
for (let i = 0; i < pairs[0].length; i++) {
	diffSum += Math.abs(pairs[0][i] - pairs[1][i])
}

console.log(diffSum)

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
	.split(" ")
	.map(n => parseInt(n, 10))

let stones = input
for (let i = 0; i < 25; i++) {
	stones = stones.flatMap(n => {
		if (n === 0) {
			return 1
		}

		const digits = Math.floor(Math.log10(n + Number.EPSILON)) + 1
		if (digits % 2 === 0) {
			const factor = Math.pow(10, digits / 2)
			return [Math.floor(n / factor), Math.floor(n % factor)]
		}

		return n * 2024
	})
}

console.log(stones.length)

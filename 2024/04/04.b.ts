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

const size = input.length // it's a square
const field: string[][] = input.map(line => line.split(""))

const get = (i: number, j: number) => {
	if (i < 0 || j < 0 || i >= size || j >= size) {
		return null
	}

	return (field[i] as string[])[j]
}

let count = 0
for (let i = 0; i < size; i++) {
	for (let j = 0; j < size; j++) {
		if (get(i, j) === "A") {
			const nn = get(i - 1, j - 1)
			const pn = get(i + 1, j - 1)
			const pp = get(i + 1, j + 1)
			const np = get(i - 1, j + 1)
			if (
				[nn, pp, np, pn].every(x => x === "M" || x === "S") &&
				nn !== pp &&
				((np === nn && pn === pp) || (np === pp && pn === nn))
			) {
				count++
			}
		}
	}
}

console.log(count)

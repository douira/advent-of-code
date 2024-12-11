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

const size = input.length // square field
const field = input.map(line => line.split("").map(v => parseInt(v, 10)))

const get = (x: number, y: number): number => {
	if (x < 0 || x >= size || y < 0 || y >= size) {
		return NaN
	}
	return (field[y] as number[])[x] as number
}

const dfs = (x: number, y: number, prev = -1): Set<string> => {
	const value = get(x, y)
	if (isNaN(value) || value !== prev + 1) {
		return new Set()
	}
	const here = `|${x},${y}`
	if (value === 9) {
		return new Set([here])
	}

	const result = new Set<string>()
	dfs(x - 1, y, value).forEach(v => result.add(v + here))
	dfs(x + 1, y, value).forEach(v => result.add(v + here))
	dfs(x, y - 1, value).forEach(v => result.add(v + here))
	dfs(x, y + 1, value).forEach(v => result.add(v + here))
	return result
}

let result = 0
for (let sx = 0; sx < size; sx++) {
	for (let sy = 0; sy < size; sy++) {
		if (get(sx, sy) === 0) {
			result += dfs(sx, sy).size
		}
	}
}

console.log(result)

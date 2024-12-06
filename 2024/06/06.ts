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
const field = input.map(line => line.split(""))

const get = (x: number, y: number) => {
	if (x < 0 || x >= size || y < 0 || y >= size) {
		return null
	}
	return (field[y] as string[])[x]
}

let direction = 0 // up, right, down, left
let x = -1,
	y = -1
for (let sx = 0; sx < size; sx++) {
	for (let sy = 0; sy < size; sy++) {
		if (get(sx, sy) === "^") {
			x = sx
			y = sy
			;(field[y] as string[])[x] = "X"
		}
	}
}

type vector = { x: number; y: number }
const directions: vector[] = [
	{ x: 0, y: -1 },
	{ x: 1, y: 0 },
	{ x: 0, y: 1 },
	{ x: -1, y: 0 },
]

while (true) {
	const dir = directions[direction] as vector
	let nx = x + dir.x
	let ny = y + dir.y

	const next = get(nx, ny)
	if (next === null) {
		break
	}
	if (next === "#") {
		direction = (direction + 1) % 4
		continue
	}

	x = nx
	y = ny
	;(field[y] as string[])[x] = "X"
}

let count = 0
for (let x = 0; x < size; x++) {
	for (let y = 0; y < size; y++) {
		if (get(x, y) === "X") {
			count++
		}
	}
}

console.log(count)

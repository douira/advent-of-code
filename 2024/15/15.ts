import fs from "fs"
import path from "path"
const [fieldRaw, movesRaw] = fs
	.readFileSync(
		path.join(
			__dirname,
			`input_${path.basename(process.argv[1] || "").split(".")[0]}`
		)
	)
	.toString()
	.trim()
	.split("\n\n")

const field = (fieldRaw as string)
	.trim()
	.split("\n")
	.map(line => line.split(""))
const fieldWidth = (field[0] as string[]).length
const fieldHeight = field.length

const directions = {
	"^": { x: 0, y: -1 },
	v: { x: 0, y: 1 },
	"<": { x: -1, y: 0 },
	">": { x: 1, y: 0 },
}
type Direction = keyof typeof directions

const moves = (movesRaw as string)
	.trim()
	.replaceAll("\n", "")
	.split("") as Direction[]

const get = (x: number, y: number) => {
	if (x < 0 || x >= fieldWidth || y < 0 || y >= fieldHeight) {
		return null
	}
	return (field[y] as string[])[x] as string
}

const set = (x: number, y: number, value: string) => {
	;(field[y] as string[])[x] = value
}

const ROBOT = "@"
const WALL = "#"
const EMPTY = "."
const BOX = "O"

let robotX: number, robotY: number
for (let y = 0; y < fieldHeight; y++) {
	for (let x = 0; x < fieldWidth; x++) {
		if (get(x, y) === ROBOT) {
			robotX = x
			robotY = y

			x = fieldWidth
			y = fieldHeight
		}
	}
}

const push = (
	x: number,
	y: number,
	dx: number,
	dy: number
): { newX: number; newY: number } | boolean => {
	const self = get(x, y)
	if (self === WALL || self === null) {
		return false
	}

	if (self === EMPTY) {
		return true
	}

	// self is BOX or ROBOT
	const newX = x + dx
	const newY = y + dy
	if (push(newX, newY, dx, dy) === false) {
		return false
	}

	// move self
	set(x, y, EMPTY)
	set(newX, newY, self)
	return { newX, newY }
}

// simulate moves
// console.log(field.map(line => line.join("")).join("\n"))
moves.forEach(move => {
	const { x: dx, y: dy } = directions[move]
	const result = push(robotX, robotY, dx, dy)
	if (typeof result === "object") {
		;({ newX: robotX, newY: robotY } = result)
	}
	// console.log(move)
	// console.log(field.map(line => line.join("")).join("\n"))
})

// collect result coordinates
let result = 0
for (let y = 0; y < fieldHeight; y++) {
	for (let x = 0; x < fieldWidth; x++) {
		if (get(x, y) === BOX) {
			result += y * 100 + x
		}
	}
}

console.log(result)
// console.log(field.map(line => line.join("")).join("\n"))

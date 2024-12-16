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

const ROBOT = "@"
const WALL = "#"
const EMPTY = "."
const SMALL_BOX = "O"
const BOX_LEFT = "["
const BOX_RIGHT = "]"

const field = (fieldRaw as string)
	.trim()
	.split("\n")
	.map(line =>
		line.split("").flatMap(cell => {
			switch (cell) {
				case WALL:
					return [WALL, WALL]
				case SMALL_BOX:
					return [BOX_LEFT, BOX_RIGHT]
				case EMPTY:
					return [EMPTY, EMPTY]
				case ROBOT:
					return [ROBOT, EMPTY]
			}
		})
	)

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
	move: Direction
): { newX: number; newY: number; revert: () => void } | boolean => {
	const self = get(x, y)
	if (self === WALL || self === null) {
		return false
	}

	if (self === EMPTY) {
		return true
	}

	const { x: dx, y: dy } = directions[move]
	const newX = x + dx
	const newY = y + dy
	if (self === ROBOT || move === "<" || move === ">") {
		// self is robot or horizontal movement of a box
		const result = push(newX, newY, move)
		if (result === false) {
			return false
		}

		// move self
		set(x, y, EMPTY)
		set(newX, newY, self)
		return {
			newX,
			newY,
			revert: () => {
				set(newX, newY, EMPTY)
				set(x, y, self)
				if (typeof result === "object") {
					result.revert()
				}
			},
		}
	} else {
		// self is BOX_LEFT or BOX_RIGHT and move is up or down
		const otherX = x + (self === BOX_LEFT ? 1 : -1)

		const resultOther = push(otherX, newY, move)
		const resultSelf = push(x, newY, move)
		if (resultOther === false || resultSelf === false) {
			if (typeof resultOther === "object") {
				resultOther.revert()
			}
			if (typeof resultSelf === "object") {
				resultSelf.revert()
			}
			return false
		}

		// move both parts of self
		set(x, y, EMPTY)
		set(x, newY, self)
		const other = get(otherX, y) as string
		set(otherX, y, EMPTY)
		set(otherX, newY, other)

		return {
			newX, newY,
			revert: () => {
				set(otherX, newY, EMPTY)
				set(otherX, y, other)
				set(x, newY, EMPTY)
				set(x, y, self)

				if (typeof resultOther === "object") {
					resultOther.revert()
				}
				if (typeof resultSelf === "object") {
					resultSelf.revert()
				}
			}
		}
	}
}

// simulate moves
console.log(field.map(line => line.join("")).join("\n"))
moves.forEach(move => {
	const result = push(robotX, robotY, move)
	if (typeof result === "object") {
		;({ newX: robotX, newY: robotY } = result)
	}
	// console.log(`\nMove: ${move}`)
	// console.log(field.map(line => line.join("")).join("\n"))
})

// collect result coordinates
let result = 0
for (let y = 0; y < fieldHeight; y++) {
	for (let x = 0; x < fieldWidth; x++) {
		if (get(x, y) === BOX_LEFT) {
			result += y * 100 + x
		}
	}
}

console.log(result)
console.log(field.map(line => line.join("")).join("\n"))

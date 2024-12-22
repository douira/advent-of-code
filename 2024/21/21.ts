import fs from "fs"
import path from "path"
const input = fs
	.readFileSync(
		path.join(
			__dirname,
			`input_${path.basename(process.argv[1] || "").split(".")[0]}test`
		)
	)
	.toString()
	.trim()
	.split("\n")

// numpad <- robot1 + arrowpad <- robot2 + arrowpad <- robot3 + arrowpad <- our control

type Vector = { x: number; y: number }

const ENTER = "A"
const LEFT = "<"
const RIGHT = ">"
const UP = "^"
const DOWN = "v"
const directions = {
	[LEFT]: { x: -1, y: 0 },
	[RIGHT]: { x: 1, y: 0 },
	[UP]: { x: 0, y: -1 },
	[DOWN]: { x: 0, y: 1 },
}

const numpad = [
	["7", "8", "9"],
	["4", "5", "6"],
	["1", "2", "3"],
	[undefined, "0", ENTER],
]
const numpadDigitToVector = numpad.reduce(
	(acc, row, y) => {
		row.forEach((digit, x) => {
			if (digit) {
				acc.set(digit, { x, y })
			}
		})
		return acc
	},
	new Map<string, Vector>()
)
const numpadStart = { x: 2, y: 3 }
const arrowpad = [
	[undefined, UP, ENTER],
	[LEFT, DOWN, RIGHT],
]
const arrowpadDigitToVector = arrowpad.reduce(
	(acc, row, y) => {
		row.forEach((digit, x) => {
			if (digit) {
				acc.set(digit, { x, y })
			}
		})
		return acc
	},
	new Map<string, Vector>()
)
const arrowpadStart = { x: 2, y: 0 }

const arrowpadMoves = [UP, LEFT, DOWN, RIGHT, ENTER]

const decodeNumpad = (vector: Vector): string | undefined => {
	const { x, y } = vector
	if (y < 0 || y >= numpad.length) {
		return undefined
	}
	const row = numpad[y]!
	if (x < 0 || x >= row.length) {
		return undefined
	}
	return row[x]!
}

const decodeArrowpad = (vector: Vector): string | undefined => {
	const { x, y } = vector
	if (y < 0 || y >= arrowpad.length) {
		return undefined
	}
	const row = arrowpad[y]!
	if (x < 0 || x >= row.length) {
		return undefined
	}
	return row[x]!
}

type State = {
	robot1: Vector // numpad position
	robot2: Vector // arrowpad position
	robot3: Vector // arrowpad position
}

enum Stage {
	ROBOT1,
	ROBOT2,
	ROBOT3,
	CONTROL,
}

const pathLength = (
	targets: string,
	state: State = {
		robot1: numpadStart,
		robot2: arrowpadStart,
		robot3: arrowpadStart,
	},
	context = Stage.ROBOT1
): number => {
	targets.split("").forEach(target => {
		const targetVector = context === Stage.ROBOT1
			? numpadDigitToVector.get(target)!
			: arrowpadDigitToVector.get(target)!
		const startVector = context === Stage.ROBOT1
			? state.robot1
			: context === Stage.ROBOT2
				? state.robot2
				: state.robot3
		const delta = {
			x: targetVector.x - startVector.x,
			y: targetVector.y - startVector.y,
		}
		const decode = context === Stage.ROBOT1 ? decodeNumpad : decodeArrowpad

	})
}

console.log(
	input.reduce(
		(acc, str) => acc + pathLength(str) * parseInt(str.match(/\d+/)![0], 10),
		0
	)
)

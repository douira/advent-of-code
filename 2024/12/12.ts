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

type Cell = {
	type: string
	area: number
	perimeter: number
	locations: Vector[]
}
type Vector = { x: number; y: number }

const size = input.length // square field
const field: Cell[][] = input.map((line, y) =>
	line.split("").map((type, x) => ({
		type,
		area: 1,
		perimeter: 0,
		locations: [{ x, y }],
	}))
)

const get = (x: number, y: number): Cell | undefined => {
	if (x < 0 || x >= size || y < 0 || y >= size) {
		return undefined
	}
	return (field[y] as Cell[])[x] as Cell
}

const joinCells = (ax: number, ay: number, bx: number, by: number) => {
	const a = get(ax, ay)
	const b = get(bx, by)
	if (!a || !b) {
		return
	}

	if (a.type === b.type && a !== b) {
		a.area += b.area
		a.locations.push(...b.locations)
		b.locations.forEach(({ x, y }) => {
			;(field[y] as Cell[])[x] = a
		})
	}
}

for (let y = 0; y < size; y++) {
	for (let x = 0; x < size; x++) {
		joinCells(x, y, x - 1, y)
		joinCells(x, y, x, y - 1)
	}
}

const visitedCells = new Set<Cell>()
for (let y = 0; y < size; y++) {
	for (let x = 0; x < size; x++) {
		const cell = get(x, y) as Cell
		if (visitedCells.has(cell)) {
			continue
		}
		visitedCells.add(cell)
		cell.perimeter = cell.locations.reduce(
			(acc, { x, y }) =>
				acc +
				[get(x - 1, y), get(x + 1, y), get(x, y - 1), get(x, y + 1)].filter(
					neighbor => neighbor?.type !== cell.type
				).length,
			0
		)
	}
}

visitedCells.clear()
let result = 0
for (let y = 0; y < size; y++) {
	for (let x = 0; x < size; x++) {
		const cell = get(x, y) as Cell
		if (visitedCells.has(cell)) {
			continue
		}
		visitedCells.add(cell)
		result += cell.perimeter * cell.area
	}
}

console.log(result)

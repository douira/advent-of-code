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
	sides: number
	price: number
	locations: Vector[]
}
type Vector = { x: number; y: number }

const size = input.length // square field
const field: Cell[][] = input.map((line, y) =>
	line.split("").map((type, x) => ({
		type,
		area: 1,
		sides: 0,
		price: 0,
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

const findSides = (alongSide: Vector, acrossSide: Vector) => {
	for (let i = 0; i <= size; i++) {
		let lastA: Cell | undefined, lastB: Cell | undefined
		for (let along = 0; along < size; along++) {
			const a = get(
				alongSide.x * along + acrossSide.x * i,
				alongSide.y * along + acrossSide.y * i
			)
			const b = get(
				alongSide.x * along + acrossSide.x * (i - 1),
				alongSide.y * along + acrossSide.y * (i - 1)
			)
			if (a !== lastA) {
				if (a && a !== b) {
					a.sides++
				}
				lastA = a
			}
			if (b !== lastB) {
				if (b && a !== b) {
					b.sides++
				}
				lastB = b
			}
			if (lastA === lastB) {
				lastA = lastB = undefined
			}
		}
	}
}
findSides({ x: 1, y: 0 }, { x: 0, y: 1 })
findSides({ x: 0, y: 1 }, { x: 1, y: 0 })

const visitedCells = new Set<Cell>()
let result = 0
for (let y = 0; y < size; y++) {
	for (let x = 0; x < size; x++) {
		const cell = get(x, y) as Cell
		if (visitedCells.has(cell)) {
			continue
		}
		visitedCells.add(cell)
		cell.price = cell.sides * cell.area
		result += cell.price
	}
}

console.log(result)

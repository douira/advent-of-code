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

type Vector = { x: number; y: number }
type Node = {
	pos: Vector
	endDistance: number
	startDistance: number
}
let start: Node | undefined
let end: Node | undefined
const field = input.map((line, y) =>
	line.split("").map((c, x) => {
		if (c === "#") {
			return undefined
		}
		const node = {
			pos: { x, y },
			endDistance: Infinity,
			startDistance: Infinity,
		}
		if (c === "S") {
			node.startDistance = 0
			start = node
		}
		if (c === "E") {
			node.endDistance = 0
			end = node
		}
		return node
	})
)
const size = field.length // square

const get = (x: number, y: number): Node | undefined => {
	if (x < 0 || y < 0 || x >= size || y >= size) {
		return undefined
	}
	return (field[y] as Node[])[x] as Node
}

if (start === undefined || end === undefined) {
	throw new Error("Start or end not found")
}

// populate start and end distances
let queue = [start]

while (queue.length) {
	const node = queue.shift()!
	const { x, y } = node.pos
	;[get(x + 1, y), get(x - 1, y), get(x, y + 1), get(x, y - 1)]
		.filter(n => n !== undefined)
		.forEach(neighbor => {
			const distance = node.startDistance + 1
			if (neighbor.startDistance > distance) {
				neighbor.startDistance = distance
				queue.push(neighbor)
			}
		})
}

queue = [end]

while (queue.length) {
	const node = queue.shift()!
	const { x, y } = node.pos
	;[get(x + 1, y), get(x - 1, y), get(x, y + 1), get(x, y - 1)]
		.filter(n => n !== undefined)
		.forEach(neighbor => {
			const distance = node.endDistance + 1
			if (neighbor.endDistance > distance) {
				neighbor.endDistance = distance
				queue.push(neighbor)
			}
		})
}

const cheats = new Map<number, Set<string>>()
const getKey = (a: Node, b: Node) =>
	`${a.pos.x},${a.pos.y}->${b.pos.x},${b.pos.y}`
const addChest = (key: string, value: number) => {
	const set = cheats.get(value) ?? new Set()
	set.add(key)
	cheats.set(value, set)
}

const regularDistance = start.endDistance

const skip = (a: Node, b: Node, stepDistance: number) => {
	const abSaved = regularDistance - (a.startDistance + b.endDistance + stepDistance)
	const baSaved = regularDistance - (a.endDistance + b.startDistance + stepDistance)

	if (abSaved > 0) {
		addChest(getKey(a, b), abSaved)
	} else if (baSaved > 0) {
		addChest(getKey(b, a), baSaved)
	}
}

const maxStepDistance = 20

for (let ay = 0; ay < size; ay++) {
	for (let ax = 0; ax < size; ax++) {
		const a = get(ax, ay)
		if (a === undefined) {
			continue
		}

		for (let by = 0; by < size; by++) {
			for (let bx = 0; bx < size; bx++) {
				if (ax === bx && ay === by) {
					continue
				}
				const dx = Math.abs(ax - bx)
				const dy = Math.abs(ay - by)
				const stepDistance = dx + dy
				if (stepDistance > maxStepDistance) {
					continue
				}

				const b = get(bx, by)
				if (b === undefined) {
					continue
				}

				skip(a, b, stepDistance)
			}
		}
	}
}

// console.log(
// 	Array.from(cheats.entries())
// 		.sort(([a], [b]) => a - b)
// 		.map(([distance, set]) => `${distance}: ${set.size}`)
// 		.join("\n")
// )

const minSavingToCount = 100

const cheatsThatCount = Array.from(cheats.entries())
	.filter(([distance]) => distance >= minSavingToCount)
	.reduce((acc, [, set]) => acc + set.size, 0)

console.log(`${cheatsThatCount} cheats saved at least ${minSavingToCount} steps`)
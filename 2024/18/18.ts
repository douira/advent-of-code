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

const processBlocks = 1024
const fieldSize = 70

const blocks = input.map(line => {
	const [x, y] = line.split(",").map(n => parseInt(n, 10)) as [number, number]
	return { x, y }
})

const blocked = new Map<string, boolean>()
for (let i = 0; i < processBlocks; i++) {
	const block = blocks[i]!
	blocked.set(`${block.x},${block.y}`, true)
}

const isBlocked = (x: number, y: number) => blocked.has(`${x},${y}`)

const queue = [{ x: 0, y: 0, steps: 0 }]
const visited = new Map<string, number>()

let stepsToGoal = 0

const add = (x: number, y: number, steps: number) => {
	if (x < 0 || y < 0 || x > fieldSize || y > fieldSize) {
		return
	}

	if (isBlocked(x, y)) {
		return
	}

	const key = `${x},${y}`
	if (visited.has(key)) {
		return
	}

	visited.set(key, steps)
	queue.push({ x, y, steps })
}

while (queue.length > 0) {
	const { x, y, steps } = queue.shift()!
	if (x === fieldSize && y === fieldSize) {
		stepsToGoal = steps
		break
	}

	const nextSteps = steps + 1
	add(x + 1, y, nextSteps)
	add(x - 1, y, nextSteps)
	add(x, y + 1, nextSteps)
	add(x, y - 1, nextSteps)
}

console.log(stepsToGoal)

// draw the field
console.log(
	Array.from({ length: fieldSize + 1 }, (_, i) =>
		Array.from({ length: fieldSize + 1 }, (_, j) =>
			isBlocked(j, i) ? "#" : "."
		).join("")
	).join("\n")
)
